#!/usr/bin/env bun

/**
 * React Compiler compatibility checker for tamagui packages
 *
 * Usage:
 *   bun scripts/react-compiler-check.ts                    # scan all packages
 *   bun scripts/react-compiler-check.ts code/ui/tooltip    # scan specific package
 *   bun scripts/react-compiler-check.ts --verbose          # show all compiler output
 */

import * as proc from 'node:child_process'
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { promisify } from 'node:util'

const exec = promisify(proc.exec)

interface CompilerError {
  file: string
  fn: string
  reason: string
  line?: number
}

interface ScanResult {
  file: string
  compiled: boolean
  errors: CompilerError[]
  hasUseNoMemo: boolean
}

const args = process.argv.slice(2)
const verbose = args.includes('--verbose')
const targetPath = args.find((a) => !a.startsWith('--'))

async function main() {
  console.info('\n🔍 React Compiler compatibility check\n')

  const packages = await getPackages()
  const filteredPackages = targetPath
    ? packages.filter((p) => p.location.includes(targetPath))
    : packages

  if (filteredPackages.length === 0) {
    console.error(`No packages found${targetPath ? ` matching "${targetPath}"` : ''}`)
    process.exit(1)
  }

  console.info(`Scanning ${filteredPackages.length} packages...\n`)

  const allResults: ScanResult[] = []
  const problemFiles: ScanResult[] = []

  for (const pkg of filteredPackages) {
    const srcDir = join(process.cwd(), pkg.location, 'src')
    const files = await getSourceFiles(srcDir)

    for (const file of files) {
      const result = await checkFile(file)
      allResults.push(result)

      if (result.errors.length > 0 && !result.hasUseNoMemo) {
        problemFiles.push(result)
      }
    }
  }

  // report
  if (problemFiles.length === 0) {
    console.info(
      '✅ All files are React Compiler compatible (or already have "use no memo")\n'
    )
    return
  }

  console.info(`\n⚠️  Found ${problemFiles.length} files with compiler issues:\n`)

  for (const result of problemFiles) {
    const relPath = relative(process.cwd(), result.file)
    console.info(`  ${relPath}`)
    for (const err of result.errors) {
      const loc = err.line ? `:${err.line}` : ''
      console.info(`    └─ ${err.fn}${loc}: ${err.reason}`)
    }
  }

  // group by error type to help prioritize
  const byErrorType = new Map<string, string[]>()
  for (const result of problemFiles) {
    for (const err of result.errors) {
      const key = err.reason.split(':')[0].trim()
      if (!byErrorType.has(key)) {
        byErrorType.set(key, [])
      }
      const relPath = relative(process.cwd(), result.file)
      if (!byErrorType.get(key)!.includes(relPath)) {
        byErrorType.get(key)!.push(relPath)
      }
    }
  }

  console.info('\n📊 Summary by error type:\n')
  for (const [type, files] of [...byErrorType.entries()].sort(
    (a, b) => b[1].length - a[1].length
  )) {
    console.info(`  ${files.length}x ${type}`)
  }

  console.info(
    '\n💡 Add "\'use no memo\'" inside each affected function to skip compilation\n'
  )
}

async function getPackages(): Promise<{ name: string; location: string }[]> {
  const output = (await exec(`bun pm ls`)).stdout
  const lines = output.split('\n').filter((line) => line.includes('workspace:'))

  return lines
    .map((line) => {
      const match = line.match(/([^\s]+)@workspace:(.+)$/)
      if (match) {
        return { name: match[1], location: match[2] }
      }
      return null
    })
    .filter(Boolean)
    .filter(
      (pkg) =>
        pkg!.location.startsWith('code/core/') || pkg!.location.startsWith('code/ui/')
    ) as { name: string; location: string }[]
}

async function getSourceFiles(dir: string): Promise<string[]> {
  const files: string[] = []

  try {
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)

      if (entry.isDirectory()) {
        files.push(...(await getSourceFiles(fullPath)))
      } else if (/\.(tsx?|jsx?)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
        files.push(fullPath)
      }
    }
  } catch {
    // dir doesn't exist
  }

  return files
}

async function checkFile(filePath: string): Promise<ScanResult> {
  const source = await readFile(filePath, 'utf-8')
  const hasUseNoMemo =
    source.includes("'use no memo'") || source.includes('"use no memo"')

  // skip files that already have the directive
  if (hasUseNoMemo) {
    return { file: filePath, compiled: false, errors: [], hasUseNoMemo: true }
  }

  const errors: CompilerError[] = []

  try {
    const babel = await import('@babel/core')
    const reactCompiler = await import('babel-plugin-react-compiler')

    const result = await babel.transformAsync(source, {
      filename: filePath,
      parserOpts: {
        plugins: ['jsx', 'typescript'],
      },
      plugins: [
        [
          reactCompiler.default,
          {
            logger: {
              logEvent: (
                _filename: string,
                event: {
                  kind: string
                  fnName?: string
                  detail?: { reason?: string; loc?: { start?: { line: number } } }
                }
              ) => {
                if (event.kind === 'CompileError') {
                  errors.push({
                    file: filePath,
                    fn: event.fnName || 'unknown',
                    reason: event.detail?.reason || 'unknown error',
                    line: event.detail?.loc?.start?.line,
                  })
                }
              },
            },
          },
        ],
      ],
    })

    const compiled = result?.code?.includes('react/compiler-runtime') ?? false

    if (verbose && (compiled || errors.length > 0)) {
      const relPath = relative(process.cwd(), filePath)
      console.info(
        `  ${compiled ? '✓' : '⏭️'} ${relPath}${errors.length ? ` (${errors.length} issues)` : ''}`
      )
    }

    return { file: filePath, compiled, errors, hasUseNoMemo: false }
  } catch (err) {
    // parse error or other issue
    if (verbose) {
      console.error(`  ✗ ${relative(process.cwd(), filePath)}: ${err}`)
    }
    return { file: filePath, compiled: false, errors: [], hasUseNoMemo: false }
  }
}

main().catch(console.error)
