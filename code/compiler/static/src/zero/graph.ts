import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

/**
 * The zero-runtime bundle gate.
 *
 * Reference erasure is what removes the modules; this is what proves it. A green
 * build is not evidence, so every integration hands its own resolved module ids
 * and importer chains to this one check and writes a machine-readable receipt.
 */

export interface ZeroGraphModule {
  id: string
  /** Direct importers of this module inside the same graph. */
  importers?: readonly string[]
}

export interface ZeroForbiddenModule {
  id: string
  /** Shortest importer chain from an entry to the forbidden module. */
  chain: string[]
}

export interface ZeroGraphReceipt {
  integration: string
  graph: 'zero' | 'island' | 'negative-control'
  entries: string[]
  moduleCount: number
  tamaguiModules: string[]
  forbidden: ZeroForbiddenModule[]
  cssArtifact: { path: string; hash: string } | null
  identity: string
  gzip?: Record<string, number>
  /**
   * Whether this build restored its artifact from a persisted plan cache
   * instead of rescanning. Only integrations that cache plans set it.
   */
  plansRestoredFromCache?: boolean
}

/**
 * The one allowlisted Tamagui client module. Everything else owned by `tamagui`
 * or an `@tamagui/*` package is forbidden in a zero entry graph.
 */
const ALLOWED_ZERO_MODULE = /animated-number/

const packageNameCache = new Map<string, string | null>()

/**
 * A module's owning package name, read from the nearest package.json.
 *
 * Path matching is not enough: in this monorepo `@tamagui/web` resolves to
 * `code/core/web/dist/...`, which contains no `@tamagui` path segment at all. A
 * gate that greps ids would report a clean graph on a bundle that ships the
 * whole runtime.
 */
export function packageNameOf(id: string): string | null {
  const clean = id.split(/[?#]/, 1)[0]!
  if (!clean || clean.startsWith('\0') || !path.isAbsolute(clean)) return null
  let dir = path.dirname(clean)
  const visited: string[] = []
  while (true) {
    const cached = packageNameCache.get(dir)
    if (cached !== undefined) {
      for (const seen of visited) packageNameCache.set(seen, cached)
      return cached
    }
    visited.push(dir)
    const manifest = path.join(dir, 'package.json')
    if (existsSync(manifest)) {
      let name: string | null = null
      try {
        name = JSON.parse(readFileSync(manifest, 'utf8')).name ?? null
      } catch {
        name = null
      }
      for (const seen of visited) packageNameCache.set(seen, name)
      return name
    }
    const parent = path.dirname(dir)
    if (parent === dir) {
      for (const seen of visited) packageNameCache.set(seen, null)
      return null
    }
    dir = parent
  }
}

export function isTamaguiModuleId(id: string): boolean {
  const name = packageNameOf(id)
  return !!name && (name === 'tamagui' || name.startsWith('@tamagui/'))
}

export function isForbiddenZeroModuleId(id: string): boolean {
  if (!isTamaguiModuleId(id)) return false
  return !ALLOWED_ZERO_MODULE.test(id)
}

function shortestChain(
  target: string,
  entries: readonly string[],
  importersOf: ReadonlyMap<string, readonly string[]>
): string[] {
  const entrySet = new Set(entries)
  const seen = new Set([target])
  const queue: string[][] = [[target]]
  // an adapter may not expose its entry modules by the same id it uses for the
  // rest of the graph, so fall back to the longest ancestor chain we can walk
  let longest: string[] = [target]
  while (queue.length) {
    const chain = queue.shift()!
    const head = chain[0]!
    if (entrySet.has(head)) return chain
    if (chain.length > longest.length) longest = chain
    for (const importer of importersOf.get(head) ?? []) {
      if (seen.has(importer)) continue
      seen.add(importer)
      queue.push([importer, ...chain])
    }
  }
  return longest
}

export function checkZeroGraph(input: {
  entries: readonly string[]
  /** The modules that actually shipped in the emitted chunks. */
  modules: readonly ZeroGraphModule[]
  /**
   * Importer edges for the whole resolved graph. A forbidden module's chain
   * usually runs through modules that were merged into another chunk, so the
   * shipped set alone cannot reconstruct it.
   */
  importerEdges?: ReadonlyMap<string, readonly string[]>
}): { tamaguiModules: string[]; forbidden: ZeroForbiddenModule[] } {
  const importersOf = new Map<string, readonly string[]>(input.importerEdges)
  for (const module of input.modules) {
    if (!importersOf.has(module.id)) importersOf.set(module.id, module.importers ?? [])
  }
  const tamaguiModules = input.modules
    .map((module) => module.id)
    .filter(isTamaguiModuleId)
    .sort()
  const forbidden = tamaguiModules
    .filter(isForbiddenZeroModuleId)
    .map((id) => ({ id, chain: shortestChain(id, input.entries, importersOf) }))
  return { tamaguiModules, forbidden }
}

export function formatZeroGraphFailure(receipt: ZeroGraphReceipt): string {
  const lines = [
    `[tamagui zero-runtime] ${receipt.integration} zero entry graph contains ${receipt.forbidden.length} forbidden Tamagui module(s)`,
    '',
  ]
  for (const entry of receipt.forbidden) {
    lines.push(entry.id)
    lines.push(
      entry.chain.length > 1
        ? `  ${entry.chain.join('\n    -> ')}`
        : `  (this bundler exposed no importer edges for that module)`
    )
  }
  lines.push('')
  lines.push(
    'Fix every site or move the owning module to a declared full-runtime island. Zero-runtime never retains one component as a fallback.'
  )
  return lines.join('\n')
}

export function writeZeroGraphReceipt(
  outDir: string,
  name: string,
  receipt: ZeroGraphReceipt
): string {
  mkdirSync(outDir, { recursive: true })
  const file = path.join(outDir, `${name}.graph.json`)
  writeFileSync(file, `${JSON.stringify(receipt, null, 2)}\n`)
  return file
}

export interface ZeroViolationSite {
  file: string
  line: number
  column: number
  code: string
  message: string
}

/**
 * The compiler collects every violation before failing, sorted by normalized
 * file path, source offset, rule, then message.
 */
export function formatZeroViolations(sites: readonly ZeroViolationSite[]): string {
  const sorted = [...sites].sort(
    (left, right) =>
      (left.file < right.file ? -1 : left.file > right.file ? 1 : 0) ||
      left.line - right.line ||
      left.column - right.column ||
      (left.code < right.code ? -1 : left.code > right.code ? 1 : 0) ||
      (left.message < right.message ? -1 : left.message > right.message ? 1 : 0)
  )
  const lines = [
    `[tamagui zero-runtime] build failed with ${sorted.length} violations`,
    '',
  ]
  for (const site of sorted) {
    lines.push(site.code)
    lines.push(`${site.file}:${site.line}:${site.column}`)
    lines.push(`  ${site.message}`)
    lines.push('')
  }
  lines.push(
    'Fix every site or move the owning module to a declared full-runtime island. Zero-runtime never retains one component as a fallback.'
  )
  return lines.join('\n')
}

/** UTF-16 offset to 1-based line/column, for diagnostic sites. */
export function offsetToLineColumn(
  source: string,
  offset: number
): { line: number; column: number } {
  let line = 1
  let lineStart = 0
  for (let index = 0; index < offset && index < source.length; index++) {
    if (source.charCodeAt(index) === 10) {
      line++
      lineStart = index + 1
    }
  }
  return { line, column: offset - lineStart + 1 }
}
