import { ZERO_FAILURE_FOOTER, type ZeroRule } from '@tamagui/compiler-core'
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
  /** The package that owns the module, which is what the gate matched on. */
  owner: string
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

/** A module's owning package: the nearest package.json and the name in it. */
export interface OwningPackage {
  name: string | null
  manifest: string
}

const owningPackageCache = new Map<string, OwningPackage | null>()

/**
 * The package that owns a module, read from the nearest package.json.
 *
 * Path matching is not enough: in this monorepo `@tamagui/web` resolves to
 * `code/core/web/dist/...`, which contains no `@tamagui` path segment at all. A
 * gate that greps ids would report a clean graph on a bundle that ships the
 * whole runtime.
 */
export function owningPackageOf(id: string): OwningPackage | null {
  const clean = id.split(/[?#]/, 1)[0]!
  if (!clean || clean.startsWith('\0') || !path.isAbsolute(clean)) return null
  let dir = path.dirname(clean)
  const visited: string[] = []
  while (true) {
    const cached = owningPackageCache.get(dir)
    if (cached !== undefined) {
      for (const seen of visited) owningPackageCache.set(seen, cached)
      return cached
    }
    visited.push(dir)
    const manifest = path.join(dir, 'package.json')
    if (existsSync(manifest)) {
      let owner: OwningPackage | null = null
      try {
        owner = { name: JSON.parse(readFileSync(manifest, 'utf8')).name ?? null, manifest }
      } catch {
        owner = { name: null, manifest }
      }
      for (const seen of visited) owningPackageCache.set(seen, owner)
      return owner
    }
    const parent = path.dirname(dir)
    if (parent === dir) {
      for (const seen of visited) owningPackageCache.set(seen, null)
      return null
    }
    dir = parent
  }
}

/**
 * `ownManifest` is the building project's own package.json.
 *
 * A project may legitimately name itself `tamagui` or `@tamagui/something` —
 * this repo's own site and examples do — and then every one of its modules
 * answers this question the same way Tamagui's do. The distinction that
 * actually holds is ownership, not spelling: Tamagui reaches a build as a
 * resolved dependency, so its modules are owned by a different package.json
 * than the one being built. Excluding the project's own manifest keeps the gate
 * a name-free rule rather than a list of names to carve out.
 */
export function isTamaguiModuleId(id: string, ownManifest?: string | null): boolean {
  const owner = owningPackageOf(id)
  if (!owner?.name) return false
  if (ownManifest && owner.manifest === ownManifest) return false
  return owner.name === 'tamagui' || owner.name.startsWith('@tamagui/')
}

export function isForbiddenZeroModuleId(id: string, ownManifest?: string | null): boolean {
  if (!isTamaguiModuleId(id, ownManifest)) return false
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
  // the project's own package.json, taken from its entries. Nothing else in
  // the graph can tell the gate which package is being built.
  const ownManifest =
    input.entries.map((entry) => owningPackageOf(entry)?.manifest).find(Boolean) ?? null
  const tamaguiModules = input.modules
    .map((module) => module.id)
    .filter((id) => isTamaguiModuleId(id, ownManifest))
    .sort()
  const forbidden = tamaguiModules
    .filter((id) => isForbiddenZeroModuleId(id, ownManifest))
    .map((id) => ({
      id,
      chain: shortestChain(id, input.entries, importersOf),
      owner: owningPackageOf(id)?.name ?? '',
    }))
  return { tamaguiModules, forbidden }
}

export function formatZeroGraphFailure(receipt: ZeroGraphReceipt): string {
  const lines = [
    `[tamagui zero-runtime] ${receipt.integration} zero entry graph contains ${receipt.forbidden.length} forbidden Tamagui module(s)`,
    '',
  ]
  for (const entry of receipt.forbidden) {
    // the package name is what the gate matched on, and the path often does not
    // show it: `@tamagui/web` resolves to `code/core/web/dist/...` here
    lines.push(entry.owner ? `${entry.id} (package ${entry.owner})` : entry.id)
    lines.push(
      entry.chain.length > 1
        ? `  ${entry.chain.join('\n    -> ')}`
        : `  (this bundler exposed no importer edges for that module)`
    )
  }
  lines.push('')
  lines.push(ZERO_FAILURE_FOOTER)
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
  rule: ZeroRule
  code: string
  component?: string
  message: string
}

/**
 * One deterministic order for every integration: normalized file path, source
 * offset, rule, then message. A build that reports its violations in a
 * different order on a different machine is not a receipt anyone can diff.
 */
export function sortZeroViolations(
  sites: readonly ZeroViolationSite[]
): ZeroViolationSite[] {
  return [...sites].sort(
    (left, right) =>
      (left.file < right.file ? -1 : left.file > right.file ? 1 : 0) ||
      left.line - right.line ||
      left.column - right.column ||
      left.rule - right.rule ||
      (left.message < right.message ? -1 : left.message > right.message ? 1 : 0)
  )
}

/** The compiler collects every violation before failing. */
export function formatZeroViolations(sites: readonly ZeroViolationSite[]): string {
  const sorted = sortZeroViolations(sites)
  const lines = [
    `[tamagui zero-runtime] build failed with ${sorted.length} violations`,
    '',
  ]
  for (const site of sorted) {
    lines.push(`Rule ${site.rule} ${site.code}`)
    lines.push(
      `${site.file}:${site.line}:${site.column}${site.component ? ` ${site.component}` : ''}`
    )
    lines.push(`  ${site.message}`)
    lines.push('')
  }
  lines.push(ZERO_FAILURE_FOOTER)
  return lines.join('\n')
}

/**
 * The machine-readable half of the same list. `report` mode writes it and exits
 * successfully; `enforce` writes it and then fails, so the two are comparable.
 */
export function writeZeroViolationReport(
  outDir: string,
  name: string,
  report: {
    integration: string
    mode: 'report' | 'enforce'
    violations: readonly ZeroViolationSite[]
  }
): string {
  mkdirSync(outDir, { recursive: true })
  const file = path.join(outDir, `${name}.violations.json`)
  writeFileSync(
    file,
    `${JSON.stringify(
      {
        integration: report.integration,
        mode: report.mode,
        count: report.violations.length,
        violations: sortZeroViolations(report.violations),
      },
      null,
      2
    )}\n`
  )
  return file
}

/**
 * An exported `styled()` declarator is only erasable because every importer in
 * this entry graph was itself transformed, and therefore lowered its uses. That
 * is a build-wide fact, so it is checked once here rather than guessed per
 * module.
 */
export function erasedExportEscape(input: {
  integration: string
  /** Module ids the zero transform actually ran on. */
  transformed: ReadonlySet<string>
  /** Erased exported binding names, by the module that declared them. */
  erasedExports: ReadonlyMap<string, readonly string[]>
  importersOf: ReadonlyMap<string, readonly string[]>
}): string | null {
  for (const [moduleId, names] of input.erasedExports) {
    if (names.length === 0) continue
    // An empty importer set here would mean the graph query saw nothing, which
    // is not the same as seeing no importers: this module is in the graph, so
    // its own entry must be there too.
    if (!input.importersOf.has(moduleId)) {
      return `[tamagui zero-runtime] ${input.integration} erased the exported definition(s) ${names.join(
        ', '
      )} from ${moduleId}, and then could not find that module in its own graph, so nothing proved the erasure was safe.\n\n${ZERO_FAILURE_FOOTER}`
    }
    const untransformed = (input.importersOf.get(moduleId) ?? []).filter(
      (importer) => !input.transformed.has(importer)
    )
    if (untransformed.length === 0) continue
    return `[tamagui zero-runtime] ${input.integration} erased the exported definition(s) ${names.join(
      ', '
    )} from ${moduleId}, but ${untransformed.length} importer(s) in this entry graph were never zero-transformed and may still reference them:\n  ${untransformed.join(
      '\n  '
    )}\n\n${ZERO_FAILURE_FOOTER}`
  }
  return null
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
