// The project checker behind `tamagui check`.
//
// Node-only entry: walks a project's source files, extracts every static flat
// value site with the sucrase tokenizer, and reports the same diagnostics the
// editor plugin and eslint rule produce, formatted as readable code frames.

import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
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

export interface CheckStyleFilesOptions {
  /** project root; file discovery and relative display paths anchor here */
  root: string
  /** path to the compiler's config artifact; default `<root>/.tamagui/tamagui.config.json` */
  configPath?: string
  /** explicit files to check instead of walking the root */
  files?: readonly string[]
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
}

export class MissingConfigArtifactError extends Error {
  constructor(configPath: string) {
    super(
      `no Tamagui config artifact at ${configPath} — run your dev server or \`tamagui generate\` once so the compiler emits it`
    )
    this.name = 'MissingConfigArtifactError'
  }
}

function walkSourceFiles(directory: string, results: string[]): void {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skippedDirectories.has(entry.name) && !entry.name.startsWith('.')) {
        walkSourceFiles(join(directory, entry.name), results)
      }
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
  const configPath =
    options.configPath ?? join(options.root, '.tamagui', 'tamagui.config.json')
  let contents: string
  try {
    contents = readFileSync(configPath, 'utf8')
  } catch {
    throw new MissingConfigArtifactError(configPath)
  }
  const tooling = createStyleTooling(JSON.parse(contents) as SerializedConfigFile)
  if (!tooling) throw new MissingConfigArtifactError(configPath)

  const document = createDocumentStyleTooling(
    tooling,
    createProjectExtractor((name) => tooling.isStyleProp(name))
  )

  let files: string[]
  if (options.files) {
    files = [...options.files]
  } else {
    files = []
    walkSourceFiles(options.root, files)
    files.sort()
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
      diagnostics = document.diagnostics(source)
    } catch {
      // a file sucrase cannot parse is a syntax error the real compiler will
      // report; the style checker stays quiet about it
      continue
    }
    if (diagnostics.length === 0) continue
    diagnosticCount += diagnostics.length
    checked.push({ file: relative(options.root, file), source, diagnostics })
  }

  return { files: checked, checkedFileCount: files.length, diagnosticCount }
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

  const summary =
    result.diagnosticCount === 0
      ? `${paint.bold('✓')} ${result.checkedFileCount} files, no flat value problems`
      : `${paint.red(paint.bold(`✗ ${result.diagnosticCount} problem${result.diagnosticCount === 1 ? '' : 's'}`))} in ${result.files.length} file${result.files.length === 1 ? '' : 's'} ${paint.dim(`(${result.checkedFileCount} checked)`)}`
  output.push(summary)
  return output.join('\n')
}
