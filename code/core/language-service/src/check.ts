// The project checker behind `tamagui check`.
//
// Node-only entry: walks a project's source files, extracts every static flat
// value site with the sucrase tokenizer, and reports the same diagnostics the
// editor plugin and eslint rule produce, formatted as readable code frames.

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
// deep paths, spelled down to the file: sucrase publishes no `exports` map, and
// a bare `sucrase/dist/parser` is a directory import that ESM cannot resolve
import { parse } from 'sucrase/dist/parser/index.js'
import { TokenType } from 'sucrase/dist/parser/tokenizer/types.js'

import { createStyleTooling, type SerializedConfigFile } from './core'
import {
  createDocumentStyleTooling,
  type DocumentDiagnostic,
  type ExtractStyleSites,
} from './document'
import { createSucraseStyleSiteExtractor } from './extract-sucrase'

const sourceExtensions = /\.(tsx|jsx)$/
const skippedDirectories = new Set([
  'node_modules',
  'dist',
  'build',
  'out',
  'coverage',
  '.git',
  '.next',
  '.expo',
  '.tamagui',
])
const projectMarkers = [
  'tamagui.build.ts',
  'tamagui.build.tsx',
  'tamagui.build.js',
  'tamagui.build.mjs',
  'tamagui.build.cjs',
]

export interface CheckStyleFilesOptions {
  /** project root; file discovery and relative display paths anchor here */
  root: string
  /** path to the compiler's config artifact; default `<root>/.tamagui/tamagui.config.json` */
  configPath?: string
  /** explicit files to check instead of walking the root */
  files?: readonly string[]
  /** validate clause payloads strictly against token and keyword vocabularies */
  strict?: boolean
}

export interface CheckedFile {
  /** root-relative display path */
  file: string
  source: string
  diagnostics: readonly DocumentDiagnostic[]
}

export interface CheckStyleFilesResult {
  files: readonly CheckedFile[]
  checkedFileCount: number
  diagnosticCount: number
  /** root-relative Tamagui projects omitted because they own another config */
  skippedProjects: readonly string[]
}

export class MissingConfigArtifactError extends Error {
  constructor(configPath: string) {
    super(
      `no Tamagui config artifact at ${configPath} — run your dev server or \`tamagui generate\` once so the compiler emits it`
    )
    this.name = 'MissingConfigArtifactError'
  }
}

function walkSourceFiles(
  directory: string,
  root: string,
  results: string[],
  skippedProjects: string[]
): void {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (skippedDirectories.has(entry.name) || entry.name.startsWith('.')) continue
      const child = join(directory, entry.name)
      if (
        projectMarkers.some((marker) => existsSync(join(child, marker))) ||
        existsSync(join(child, '.tamagui', 'tamagui.config.json'))
      ) {
        skippedProjects.push(relative(root, child))
        continue
      }
      walkSourceFiles(child, root, results, skippedProjects)
      continue
    }
    if (sourceExtensions.test(entry.name)) results.push(join(directory, entry.name))
  }
}

export function createProjectExtractor(
  isStyleProp: (name: string) => boolean
): ExtractStyleSites {
  return createSucraseStyleSiteExtractor({ parse, TokenType }, { isStyleProp })
}

export function checkStyleFiles(options: CheckStyleFilesOptions): CheckStyleFilesResult {
  const root = resolve(options.root)
  const configPath = options.configPath ?? join(root, '.tamagui', 'tamagui.config.json')
  let contents: string
  try {
    contents = readFileSync(configPath, 'utf8')
  } catch {
    throw new MissingConfigArtifactError(configPath)
  }
  const tooling = createStyleTooling(JSON.parse(contents) as SerializedConfigFile, {
    strictPayloads: options.strict,
  })
  if (!tooling) throw new MissingConfigArtifactError(configPath)

  const document = createDocumentStyleTooling(
    tooling,
    createProjectExtractor((name) => tooling.isStyleProp(name)),
    { strictPayloads: options.strict }
  )

  let files: string[]
  const skippedProjects: string[] = []
  if (options.files) {
    files = [...options.files]
  } else {
    files = []
    const insideGit = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], {
      cwd: root,
      encoding: 'utf8',
    })
    if (insideGit.status === 0) {
      const listed = spawnSync(
        'git',
        [
          'ls-files',
          '--cached',
          '--others',
          '--exclude-standard',
          '-z',
          '--',
          '*.tsx',
          '*.jsx',
        ],
        {
          cwd: root,
          encoding: 'utf8',
          maxBuffer: 64 * 1024 * 1024,
        }
      )
      if (listed.error) throw listed.error
      if (listed.status !== 0) {
        throw new Error(listed.stderr.trim() || 'git ls-files failed')
      }
      const skipped = new Set<string>()
      const projectByDirectory = new Map<string, string | null>()
      for (const relativeFile of listed.stdout.split('\0')) {
        if (!relativeFile) continue
        const file = join(root, relativeFile)
        if (!existsSync(file)) continue
        let directory = dirname(file)
        let nestedProject: string | null = null
        const visited: string[] = []
        while (directory !== root) {
          if (projectByDirectory.has(directory)) {
            nestedProject = projectByDirectory.get(directory) ?? null
            break
          }
          visited.push(directory)
          if (
            projectMarkers.some((marker) => existsSync(join(directory, marker))) ||
            existsSync(join(directory, '.tamagui', 'tamagui.config.json'))
          ) {
            nestedProject = directory
            break
          }
          directory = dirname(directory)
        }
        for (const visitedDirectory of visited) {
          projectByDirectory.set(visitedDirectory, nestedProject)
        }
        if (nestedProject) {
          skipped.add(relative(root, nestedProject))
        } else {
          files.push(file)
        }
      }
      skippedProjects.push(...skipped)
    } else {
      walkSourceFiles(root, root, files, skippedProjects)
    }
    files.sort()
    skippedProjects.sort()
  }

  const checked: CheckedFile[] = []
  let diagnosticCount = 0
  for (const file of files) {
    let source: string
    try {
      source = readFileSync(file, 'utf8')
    } catch {
      continue
    }
    let diagnostics: readonly DocumentDiagnostic[]
    try {
      diagnostics = document.diagnostics(source, undefined, {
        strictPayloads: options.strict,
      })
    } catch {
      // a file sucrase cannot parse is a syntax error the real compiler will
      // report; the style checker stays quiet about it
      continue
    }
    if (diagnostics.length === 0) continue
    diagnosticCount += diagnostics.length
    checked.push({ file: relative(root, file), source, diagnostics })
  }

  return {
    files: checked,
    checkedFileCount: files.length,
    diagnosticCount,
    skippedProjects,
  }
}

const ansi = {
  red: (text: string) => `\x1b[31m${text}\x1b[39m`,
  dim: (text: string) => `\x1b[2m${text}\x1b[22m`,
  bold: (text: string) => `\x1b[1m${text}\x1b[22m`,
  cyan: (text: string) => `\x1b[36m${text}\x1b[39m`,
}
const plain = {
  red: (text: string) => text,
  dim: (text: string) => text,
  bold: (text: string) => text,
  cyan: (text: string) => text,
}

function lineStarts(source: string): number[] {
  const starts = [0]
  for (let index = 0; index < source.length; index++) {
    if (source.charCodeAt(index) === 10) starts.push(index + 1)
  }
  return starts
}

function positionOf(starts: number[], offset: number): { line: number; column: number } {
  let low = 0
  let high = starts.length - 1
  while (low < high) {
    const mid = (low + high + 1) >> 1
    if (starts[mid] <= offset) low = mid
    else high = mid - 1
  }
  return { line: low, column: offset - starts[low] }
}

/** human-readable report: one code frame per diagnostic, caret-underlined */
export function formatCheckResults(
  result: CheckStyleFilesResult,
  options: { color?: boolean } = {}
): string {
  const paint = options.color === false ? plain : ansi
  const output: string[] = []

  for (const checked of result.files) {
    const starts = lineStarts(checked.source)
    const lines = checked.source.split('\n')
    for (const diagnostic of checked.diagnostics) {
      const start = positionOf(starts, diagnostic.start)
      const end = positionOf(starts, diagnostic.end)
      output.push(
        `${paint.bold(checked.file)}${paint.dim(`:${start.line + 1}:${start.column + 1}`)} ${paint.red('error')} ${diagnostic.message}`
      )
      const line = lines[start.line] ?? ''
      const gutter = String(start.line + 1)
      output.push(`  ${paint.dim(`${gutter} │`)} ${line}`)
      const underlineLength =
        end.line === start.line
          ? Math.max(1, end.column - start.column)
          : Math.max(1, line.length - start.column)
      output.push(
        `  ${paint.dim(`${' '.repeat(gutter.length)} │`)} ${' '.repeat(start.column)}${paint.red('^'.repeat(underlineLength))}`
      )
      output.push('')
    }
  }

  if (result.skippedProjects.length > 0) {
    output.push(
      paint.dim(`Skipped nested Tamagui projects: ${result.skippedProjects.join(', ')}`)
    )
  }

  const summary =
    result.diagnosticCount === 0
      ? `${paint.bold('✓')} ${result.checkedFileCount} files, no flat value problems`
      : `${paint.red(paint.bold(`✗ ${result.diagnosticCount} problem${result.diagnosticCount === 1 ? '' : 's'}`))} in ${result.files.length} file${result.files.length === 1 ? '' : 's'} ${paint.dim(`(${result.checkedFileCount} checked)`)}`
  output.push(summary)
  return output.join('\n')
}
