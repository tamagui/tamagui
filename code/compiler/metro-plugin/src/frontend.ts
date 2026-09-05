import { existsSync, watch, type FSWatcher } from 'node:fs'
import { readFile, readdir, realpath } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { basename, dirname, join, relative, resolve, sep } from 'node:path'

import ignore, { type Ignore } from 'ignore'

import {
  JsonFileCache,
  ModulePlanCache,
  PLAN_CACHE_SCHEMA_VERSION,
  ProjectGraph,
  contentHash,
  createExternalClosureLookup,
  defaultPlanCacheRoot,
  isTamaguiSpecifier,
  lowerModule,
  materializeModule,
  moduleClosureDigest,
  moduleClosureNode,
  planCacheKey,
  resolvedModuleId,
  stableStringify,
  yukuFactory,
  type CompilerLoweringHost,
  type CompilerTarget,
  type HostModuleInput,
  type HostResolvedImport,
  type LoweredModulePlan,
  type ModuleClosureNode,
  type ResolvedModuleId,
} from '@tamagui/compiler-core'
import Static, {
  ComponentDiscovery,
  createComponentRegistry,
  createTamaguiCompilerHost,
} from '@tamagui/static'
import type {
  IslandThemeBridge,
  TamaguiOptions,
  TamaguiProjectInfo,
} from '@tamagui/static'

import {
  compileWithUserBabel,
  userBabelCacheKey,
  type MetroBabelTransformArgs,
} from './babel'
import { zeroModuleKey, type MetroZeroController } from './zeroRuntime'
import {
  METRO_COMPILER_CACHE_VERSION,
  MetroCompilerCache,
  defaultMetroCompilerCacheRoot,
  type MetroCompilerCacheEntry,
} from './compilerCache'
import { metroDiagnostic, type MetroCompilerDiagnostic } from './diagnostics'
import {
  createMetroCompilerResolver,
  isCompilerSourceFile,
  moduleSpecifiersFromAst,
  type MetroResolverConfig,
} from './metroResolver'

interface CompiledRecord {
  input: HostModuleInput
  sourceHash: string
  /** Specifiers that reached the compiled output as require() calls instead of imports. */
  requireSpecifiers: string[]
}

/**
 * Metro runs the user's whole Babel transformer over every project source just
 * to read its import specifiers, which is the single most expensive step of the
 * prepass. The result is a pure function of the module's own bytes plus the
 * resolver and Babel identity, so it caches per file with no closure involved.
 */
export const METRO_RECORD_CACHE_VERSION = 2

interface CachedRecord {
  schemaVersion: typeof METRO_RECORD_CACHE_VERSION
  sourceHash: string
  imports: HostResolvedImport[]
  requireSpecifiers: string[]
  /** Resolve failures replayed on a hit, so a cached record reports what a fresh one did. */
  diagnostics: MetroCompilerDiagnostic[]
}

export interface MetroCompilerFrontendConfig extends MetroResolverConfig {
  cacheRoot?: string
  /** Present only for an enforced zero-runtime web build. */
  zero?: MetroZeroController | null
  originalBabelTransformerPath: string
  transformer?: Record<string, any>
  tamaguiOptions?: Partial<TamaguiOptions>
  loadCompilerProject?: (
    target: CompilerTarget,
    platform: string | null
  ) => Promise<MetroCompilerProject>
  watch?: boolean
  reportDiagnostic?: (diagnostic: MetroCompilerDiagnostic) => void
}

export interface MetroCompilerProject extends Static.CompilerProject {}

export interface MetroCompilerScanOptions {
  dev: boolean
  entryFiles: readonly string[]
  hot: boolean
  platform: string | null
  transform?: Record<string, any>
}

export interface MetroCompilerGeneration {
  generation: string
  moduleIds: string[]
  diagnostics: MetroCompilerDiagnostic[]
}

export interface MetroCompilerUpdate {
  changed: boolean
  affectedIds: string[]
  generation: string | null
}

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0
}

const requireFromFrontend = createRequire(
  typeof __filename === 'string' ? __filename : import.meta.url
)

// upgrading the compiler must invalidate published plans even when the Tamagui
// config output is unchanged
const compilerImplementationVersions = (
  ['@tamagui/metro-plugin', '@tamagui/static', '@tamagui/compiler-core'] as const
).map((packageName) => {
  const { version } = requireFromFrontend(`${packageName}/package.json`) as {
    version: string
  }
  return `${packageName}@${version}`
})

function scanOptionsHash(
  options: MetroCompilerScanOptions,
  projectGeneration: string,
  projectSourcesHash: string
): string {
  return contentHash(JSON.stringify({ options, projectGeneration, projectSourcesHash }))
}

// Metro entries can live inside node_modules (expo-router's entry reaches app
// source only through require.context), so reachability from the entry alone
// discovers nothing there. Project source is walked directly and seeded into
// the scan alongside the entry; imports then extend the graph outside the
// project root (workspace packages) exactly as before.
//
// The walked list is both the seed set and the plan cache's options hash, so it
// has to be authored source only. Build output is whatever the project already
// declares as ignored, read with git's own rules: a directory-name list cannot
// know that `dist-metro`, `out` or `public/assets` are output, and a sibling
// bundler's content-hashed filenames then re-key the plan cache on every
// unrelated rebuild, forcing Metro to rescan a project that never changed.
// `node_modules` is skipped structurally instead, because that is the same
// externality boundary the resolver draws and it must hold with or without a
// declaration.
interface IgnoreScope {
  dir: string
  matcher: Ignore
}

const speculativeWalkExcludedDirs = new Set([
  '__tests__',
  'e2e',
  'flows',
  'plugins',
  'screenshots',
  'scripts',
  'test',
  'test-results',
  'tests',
])

async function walkProjectSources(root: string): Promise<string[]> {
  // git reads every .gitignore from the repository root down to the file, so an
  // app nested in a monorepo inherits the declarations made above it
  const inherited: string[] = []
  let ancestor = root
  while (!existsSync(join(ancestor, '.git'))) {
    const parent = dirname(ancestor)
    if (parent === ancestor) break
    inherited.unshift(parent)
    ancestor = parent
  }
  const rootScopes: IgnoreScope[] = []
  for (const dir of inherited) {
    const source = await readFile(join(dir, '.gitignore'), 'utf8').catch(() => null)
    if (source) rootScopes.push({ dir, matcher: ignore().add(source) })
  }

  const found: string[] = []
  const stack: { dir: string; scopes: IgnoreScope[] }[] = [
    { dir: root, scopes: rootScopes },
  ]
  while (stack.length) {
    const { dir, scopes } = stack.pop()!
    let entries
    try {
      entries = await readdir(dir, { withFileTypes: true })
    } catch {
      continue
    }
    let active = scopes
    if (entries.some((entry) => entry.isFile() && entry.name === '.gitignore')) {
      const source = await readFile(join(dir, '.gitignore'), 'utf8').catch(() => null)
      if (source) active = [...scopes, { dir, matcher: ignore().add(source) }]
    }
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
      const isDirectory = entry.isDirectory()
      if (isDirectory && speculativeWalkExcludedDirs.has(entry.name)) continue
      if (!isDirectory && !(entry.isFile() && isCompilerSourceFile(entry.name))) continue
      if (
        !isDirectory &&
        (/(?:^|[-.])(?:probe|run|spec|tests?)(?:[-.]|$)/i.test(entry.name) ||
          /\.(?:build|config|workspace)\.[cm]?[jt]sx?$/.test(entry.name))
      ) {
        continue
      }
      const path = join(dir, entry.name)
      let ignored = false
      for (const scope of active) {
        const relativePath = relative(scope.dir, path)
        if (!relativePath || relativePath.startsWith('..')) continue
        const candidate = relativePath.split(sep).join('/') + (isDirectory ? '/' : '')
        if (scope.matcher.ignores(candidate)) {
          ignored = true
          break
        }
      }
      if (ignored) continue
      if (isDirectory) stack.push({ dir: path, scopes: active })
      else found.push(path)
    }
  }
  return found.sort(compareCodeUnits)
}

function compilerTarget(platform: string | null): CompilerTarget {
  return platform === 'web' ? 'web' : 'native'
}

function retainsLiveGraph(options: MetroCompilerScanOptions): boolean {
  return options.dev && options.hot
}

export class MetroCompilerFrontend {
  readonly #cacheBaseRoot: string
  readonly #entries = new Map<ResolvedModuleId, MetroCompilerCacheEntry>()
  readonly #records = new Map<ResolvedModuleId, CompiledRecord>()
  readonly #watchers = new Map<ResolvedModuleId, FSWatcher>()
  readonly #resolver
  #graph: ProjectGraph | null = null
  #host: CompilerLoweringHost | null = null
  #registry: Static.CompilerComponentRegistry | null = null
  readonly #discovery = new ComponentDiscovery()
  readonly #externalClosure = createExternalClosureLookup()
  #projectGeneration: string | null = null
  #publishedGeneration: string | null = null
  #scanOptions: MetroCompilerScanOptions | null = null
  #scanOptionsHash: string | null = null
  #operationQueue: Promise<void> = Promise.resolve()
  #tamaguiConfig: TamaguiProjectInfo['tamaguiConfig'] | null = null
  #zeroEntryGraph: Set<ResolvedModuleId> | null = null
  readonly #planKeys = new Map<ResolvedModuleId, { key: string; digest: string }>()
  #recordCache: JsonFileCache | null = null
  #recordCacheIdentity: string | null = null
  #planCache: ModulePlanCache | null = null
  #planCacheStamp: string | null = null

  constructor(readonly config: MetroCompilerFrontendConfig) {
    this.#cacheBaseRoot =
      config.cacheRoot ?? defaultMetroCompilerCacheRoot(config.projectRoot)
    this.#resolver = createMetroCompilerResolver(config)
  }

  get metroResolverVersion(): string {
    return this.#resolver.version
  }

  /**
   * Per-file cache accounting for the last scan. The point of these caches is
   * that one edited module leaves every other module's entry valid, and this is
   * how that is observed rather than assumed.
   */
  get compileCacheStats(): {
    plans: { hits: number; misses: number; writes: number }
    records: { hits: number; misses: number; writes: number }
  } {
    const empty = { hits: 0, misses: 0, writes: 0 }
    return {
      plans: this.#planCache?.stats ?? empty,
      records: this.#recordCache?.stats ?? empty,
    }
  }

  cacheRootFor(platform: string | null): string {
    return join(this.#cacheBaseRoot, platform ?? 'default')
  }

  scan(options: MetroCompilerScanOptions): Promise<MetroCompilerGeneration> {
    return this.#enqueue(() => this.#scan(options))
  }

  async #scan(
    options: MetroCompilerScanOptions,
    preparedProject?: MetroCompilerProject,
    preparedProjectSources?: string[]
  ): Promise<MetroCompilerGeneration> {
    this.#scanOptions = options
    this.#publishedGeneration = null
    const diagnostics: MetroCompilerDiagnostic[] = []
    const entryRoots = (
      await Promise.all(
        options.entryFiles.map((path) => realpath(resolve(this.config.projectRoot, path)))
      )
    ).sort(compareCodeUnits)
    const compilerProject =
      preparedProject ??
      (await this.#loadCompilerProject(options, entryRoots[0], diagnostics))
    this.#projectGeneration = compilerProject.generation
    const projectSources =
      preparedProjectSources ?? (await walkProjectSources(this.config.projectRoot))
    const projectSourcesHash = contentHash(JSON.stringify(projectSources))
    this.#scanOptionsHash = scanOptionsHash(
      options,
      compilerProject.generation,
      projectSourcesHash
    )
    this.#installCaches(options, compilerProject, projectSourcesHash)
    const speculativeRoots = new Set<string>()
    for (const file of projectSources) {
      try {
        const id = await realpath(file)
        if (!entryRoots.includes(id)) speculativeRoots.add(id)
      } catch {}
    }
    const roots = [...new Set([...entryRoots, ...speculativeRoots])].sort(
      compareCodeUnits
    )
    const queue = [...roots]
    const queued = new Set(queue)
    for (const watcher of this.#watchers.values()) watcher.close()
    this.#watchers.clear()
    this.#records.clear()

    while (queue.length) {
      const path = queue.shift()!
      try {
        const record = await this.#compileRecord(path, options, diagnostics)
        this.#records.set(record.input.id, record)
        for (const dependency of record.input.imports) {
          if (
            dependency.external ||
            !isCompilerSourceFile(dependency.resolvedId) ||
            queued.has(dependency.resolvedId)
          ) {
            continue
          }
          queued.add(dependency.resolvedId)
          queue.push(dependency.resolvedId)
        }
      } catch (error) {
        // walk-seeded files are speculative: nothing proved the bundle needs
        // them, so a compile failure is not a build diagnostic. If the bundle
        // does include one, the transformer's plan-miss warning still fires.
        if (speculativeRoots.has(path)) continue
        const diagnostic = metroDiagnostic(
          'metro/transform-failed',
          `Failed to compile ${path}: ${error instanceof Error ? error.message : String(error)}`,
          { moduleId: path }
        )
        diagnostics.push(diagnostic)
        this.#report(diagnostic)
      }
    }

    if (
      !compilerProject.projectInfo.tamaguiConfig ||
      !compilerProject.projectInfo.components
    ) {
      throw new Error('Metro compiler project has no Tamagui config or components')
    }
    this.#tamaguiConfig = compilerProject.projectInfo.tamaguiConfig
    this.#entries.clear()
    const unplanned = await this.#restorePlans(options)
    const zero = this.config.zero
    // a scan that restores everything builds no graph, so the previous scan's
    // graph must not survive as this scan's answer
    this.#graph = null
    this.#host = null
    // Nothing left to compile and no live session to serve means the analyzer
    // graph is never read, so it is never built. Parsing and linking every
    // project source is the other half of the prepass cost.
    if (unplanned.length || retainsLiveGraph(options)) {
      this.#graph = new ProjectGraph(yukuFactory, {
        modules: [...this.#records.values()].map(({ input }) => input),
      })
      const componentModules = compilerProject.componentModules.map(
        ({ moduleName, id }) => ({ moduleName, resolvedId: id })
      )
      // a new project generation may carry new static configs, so discovery
      // starts over with it and re-registers what it finds
      this.#discovery.clear()
      this.#registry = createComponentRegistry(
        compilerProject.projectInfo.components,
        componentModules
      )
      this.#host = createTamaguiCompilerHost({
        target: compilerTarget(options.platform),
        tamaguiConfig: compilerProject.projectInfo.tamaguiConfig,
        components: compilerProject.projectInfo.components,
        componentModules,
        registry: this.#registry,
        disablePartialExtraction: compilerProject.disablePartialExtraction,
        experimentalNativeFastPath: compilerProject.experimentalNativeFastPath,
        zeroRuntime: compilerProject.zeroRuntime,
      })
      if (zero) {
        if (zero.isEnforcing) {
          Static.assertZeroConfigDrivers(compilerProject.projectInfo.tamaguiConfig)
        }
        zero.plansRestoredFromCache = false
        zero.configCSS = compilerProject.projectInfo.tamaguiConfig.getCSS?.() ?? ''
        zero.artifact.clearGraphs()
        zero.bridges.clear()
        zero.violations.length = 0
        zero.transformed.clear()
        zero.erasedExports.clear()
        // The zero contract applies to an ENTRY GRAPH. Metro's frontend plans
        // every project source by directory walk, so a config module, a control
        // fixture, or another entry's page would otherwise be judged against a
        // contract they are not part of.
        this.#zeroEntryGraph = this.#reachableFrom(entryRoots.map(resolvedModuleId))
      }
      for (const id of unplanned) await this.#refreshEntry(id)
      await this.#storePlans(unplanned)
    }
    if (zero) {
      // Written in both modes and before the failure, so `report` and `enforce`
      // emit the identical list and only their exit differs.
      Static.writeZeroViolationReport(zero.resolved.outDir, 'metro-zero', {
        integration: 'metro-web',
        mode: zero.isEnforcing ? 'enforce' : 'report',
        violations: zero.violations,
      })
      if (zero.isEnforcing && zero.violations.length) {
        throw new Error(Static.formatZeroViolations(zero.violations))
      }
    }
    const totalFound = [...this.#entries.values()].reduce(
      (sum, entry) => sum + entry.plan.stats.found,
      0
    )
    if (this.#entries.size > 0 && totalFound === 0) {
      const componentNames = compilerProject.componentModules.map(
        ({ moduleName }) => moduleName
      )
      const cjsComponentImporters = [...this.#records.values()].filter((record) =>
        record.requireSpecifiers.some((specifier) =>
          componentNames.some(
            (name) => specifier === name || specifier.startsWith(`${name}/`)
          )
        )
      ).length
      if (cjsComponentImporters > 0) {
        const diagnostic = metroDiagnostic(
          'metro/no-linked-components',
          `The Tamagui compiler linked 0 components across ${this.#entries.size} modules even though ` +
            `${cjsComponentImporters} module(s) reference ${componentNames.join(', ')} through require() calls. ` +
            `Metro compiled modules to CommonJS before the compiler could analyze them, so component ` +
            `imports cannot be linked and nothing will be optimized. Enable experimentalImportSupport ` +
            `in your transformer's getTransformOptions (Expo enables it by default) to restore ` +
            `Tamagui compilation.`
        )
        diagnostics.push(diagnostic)
        this.#report(diagnostic)
      }
    }
    const generation = await this.#publish(options.platform)
    const moduleIds = [...this.#records.keys()].sort(compareCodeUnits)
    if (this.config.watch !== false && retainsLiveGraph(options)) {
      this.#installWatchers()
    } else if (!retainsLiveGraph(options)) {
      this.#releaseGraph()
    }
    return {
      generation,
      moduleIds,
      diagnostics,
    }
  }

  ensureValidCache(options: MetroCompilerScanOptions): Promise<MetroCompilerGeneration> {
    return this.#enqueue(() => this.#ensureValidCache(options))
  }

  async #ensureValidCache(
    options: MetroCompilerScanOptions
  ): Promise<MetroCompilerGeneration> {
    const diagnostics: MetroCompilerDiagnostic[] = []
    const firstEntry = options.entryFiles[0]
    const importer = firstEntry
      ? await realpath(resolve(this.config.projectRoot, firstEntry))
      : this.config.projectRoot
    const compilerProject = await this.#loadCompilerProject(
      options,
      importer,
      diagnostics
    )
    const cache = new MetroCompilerCache(this.cacheRootFor(options.platform))
    const validation = await cache.validate()
    const projectSources = await walkProjectSources(this.config.projectRoot)
    const optionsHash = scanOptionsHash(
      options,
      compilerProject.generation,
      contentHash(JSON.stringify(projectSources))
    )
    if (
      validation.valid &&
      validation.generation &&
      validation.optionsHash === optionsHash &&
      (await this.#sourcesAreFresh(validation.sourceHashes)) &&
      ((!retainsLiveGraph(options) && !this.#graph) ||
        (this.#publishedGeneration && this.#scanOptionsHash === optionsHash)) &&
      // A zero build owns the one CSS artifact, and its contents are produced by
      // the scan. Reusing a published plan without restoring the artifact would
      // emit one missing every rule this process never collected, while still
      // deriving TAMAGUI_DID_OUTPUT_CSS from it. The sidecar carries exactly
      // those side effects; without it there is nothing safe to reuse.
      (await this.#rehydrateZeroCSS(cache, validation.generation))
    ) {
      this.#publishedGeneration = validation.generation
      this.#scanOptions = options
      this.#scanOptionsHash = optionsHash
      this.#projectGeneration = compilerProject.generation
      return {
        generation: validation.generation,
        moduleIds: validation.moduleIds,
        diagnostics,
      }
    }
    for (const diagnostic of validation.diagnostics) this.#report(diagnostic)
    await cache.discardManifest()
    return await this.#scan(options, compilerProject, projectSources)
  }

  async updateFile(path: string): Promise<MetroCompilerUpdate> {
    let result: MetroCompilerUpdate = {
      changed: false,
      affectedIds: [],
      generation: null,
    }
    return this.#enqueue(async () => {
      const graph = this.#graph
      const options = this.#scanOptions
      if (!graph || !options) return result
      let record: CompiledRecord
      const diagnostics: MetroCompilerDiagnostic[] = []
      try {
        record = await this.#compileRecord(path, options, diagnostics)
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          const id = resolvedModuleId(resolve(path))
          const invalidation = graph.removeModule(id)
          this.#watchers.get(id)?.close()
          this.#watchers.delete(id)
          this.#records.delete(id)
          this.#entries.delete(id)
          for (const affected of invalidation.invalidatedIds) {
            if (affected !== id) await this.#refreshEntry(affected)
          }
          const generation = await this.#publish(options.platform)
          result = {
            changed: invalidation.changed,
            affectedIds: invalidation.invalidatedIds,
            generation,
          }
          return result
        }
        const diagnostic = metroDiagnostic(
          'metro/transform-failed',
          `Failed to update ${path}: ${error instanceof Error ? error.message : String(error)}`,
          { moduleId: path }
        )
        this.#report(diagnostic)
        return result
      }

      for (const dependency of record.input.imports) {
        if (
          dependency.external ||
          !isCompilerSourceFile(dependency.resolvedId) ||
          this.#records.has(dependency.resolvedId)
        ) {
          continue
        }
        await this.#addDependency(dependency.resolvedId, options, diagnostics)
      }
      this.#records.set(record.input.id, record)
      const invalidation = graph.updateModule(record.input)
      for (const affected of invalidation.invalidatedIds)
        await this.#refreshEntry(affected)
      const generation = invalidation.changed
        ? await this.#publish(options.platform)
        : null
      result = {
        changed: invalidation.changed,
        affectedIds: invalidation.invalidatedIds,
        generation,
      }
      if (this.config.watch !== false && retainsLiveGraph(options)) {
        this.#watchModule(record.input.id)
      }
      return result
    })
  }

  /** A published plan only applies while every recorded module source is unchanged. */
  async #sourcesAreFresh(sourceHashes: Record<string, string>): Promise<boolean> {
    const checks = Object.entries(sourceHashes).map(async ([moduleId, sourceHash]) => {
      try {
        return contentHash(await readFile(moduleId, 'utf8')) === sourceHash
      } catch {
        return false
      }
    })
    return (await Promise.all(checks)).every(Boolean)
  }

  #enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const queued = this.#operationQueue.then(operation)
    this.#operationQueue = queued.then(
      () => undefined,
      () => undefined
    )
    return queued
  }

  close(): Promise<void> {
    return this.#enqueue(async () => {
      this.#releaseGraph()
    })
  }

  #releaseGraph(): void {
    for (const watcher of this.#watchers.values()) watcher.close()
    this.#watchers.clear()
    this.#entries.clear()
    this.#records.clear()
    this.#planKeys.clear()
    this.#graph = null
    this.#host = null
    this.#registry = null
    this.#projectGeneration = null
  }

  async #loadCompilerProject(
    options: MetroCompilerScanOptions,
    importer: string,
    diagnostics: MetroCompilerDiagnostic[]
  ): Promise<MetroCompilerProject> {
    const target = compilerTarget(options.platform)
    if (this.config.loadCompilerProject) {
      return await this.config.loadCompilerProject(target, options.platform)
    }
    return Static.loadCompilerProject({
      root: this.config.projectRoot,
      target,
      options: this.config.tamaguiOptions ?? {},
      hostVersions: compilerImplementationVersions,
      missingProjectMessage: 'Unable to load the Tamagui project for Metro compilation',
      generation: (projectInfo, componentModules, normalizedOptions) => {
        return contentHash(
          JSON.stringify({
            cacheVersion: METRO_COMPILER_CACHE_VERSION,
            compilerImplementationVersions,
            componentModules,
            configCss: projectInfo.tamaguiConfig?.getCSS?.() ?? '',
            disablePartialExtraction: !!normalizedOptions.disablePartialExtraction,
            experimentalNativeFastPath:
              target === 'native' &&
              normalizedOptions.experimental?.nativeFastPath === true,
            target,
            // the host's diagnostics are mode-aware, so a plan built in one mode is
            // not a plan the other mode may reuse
            zeroRuntime: !!this.config.zero,
          })
        )
      },
      resolveComponents: async (moduleNames) => {
        const componentModules: MetroCompilerProject['componentModules'] = []
        for (const moduleName of moduleNames) {
          try {
            const resolution = this.#resolver.resolve(
              importer,
              { specifier: moduleName, isESMImport: true },
              options.platform
            )
            if (!resolution) continue
            componentModules.push({ moduleName, id: resolution.resolvedId })
          } catch (error) {
            const diagnostic = metroDiagnostic(
              'metro/resolve-failed',
              `Failed to resolve compiler component ${moduleName}: ${error instanceof Error ? error.message : String(error)}`,
              { moduleId: importer, dependency: moduleName }
            )
            diagnostics.push(diagnostic)
            this.#report(diagnostic)
          }
        }
        return componentModules
      },
    })
  }

  async #compileRecord(
    rawPath: string,
    options: MetroCompilerScanOptions,
    diagnostics: MetroCompilerDiagnostic[]
  ): Promise<CompiledRecord> {
    const path = await realpath(resolve(rawPath))
    const source = await readFile(path, 'utf8')
    const sourceHash = contentHash(source)
    const id = resolvedModuleId(path)
    const cache = this.#recordCache
    const identity = this.#recordCacheIdentity
    const key = cache && identity ? contentHash(`${identity}\0${sourceHash}`) : null
    if (cache && key) {
      const cached = await cache.read(key, (value) => {
        const entry = value as CachedRecord | null
        return entry?.schemaVersion === METRO_RECORD_CACHE_VERSION &&
          entry.sourceHash === sourceHash &&
          Array.isArray(entry.imports) &&
          Array.isArray(entry.requireSpecifiers) &&
          Array.isArray(entry.diagnostics)
          ? entry
          : null
      })
      if (cached) {
        for (const diagnostic of cached.diagnostics) {
          diagnostics.push(diagnostic)
          this.#report(diagnostic)
        }
        return {
          input: { id, source, imports: cached.imports },
          sourceHash,
          requireSpecifiers: cached.requireSpecifiers,
        }
      }
    }

    const args = this.#babelArgs(path, source, options)
    const compiled = await compileWithUserBabel(
      this.config.originalBabelTransformerPath,
      args
    )
    const imports: HostResolvedImport[] = []
    const requireSpecifiers: string[] = []
    const recordDiagnostics: MetroCompilerDiagnostic[] = []
    for (const dependency of moduleSpecifiersFromAst(compiled.result.ast)) {
      if (!dependency.isESMImport) requireSpecifiers.push(dependency.specifier)
      try {
        const resolution = this.#resolver.resolve(path, dependency, options.platform)
        if (!resolution) continue
        imports.push({
          specifier: resolution.specifier,
          resolvedId: resolvedModuleId(resolution.resolvedId),
          external: resolution.external,
        })
      } catch (error) {
        recordDiagnostics.push(
          metroDiagnostic(
            'metro/resolve-failed',
            `Failed to resolve ${dependency.specifier} from ${path}: ${error instanceof Error ? error.message : String(error)}`,
            { moduleId: path, dependency: dependency.specifier }
          )
        )
      }
    }
    for (const diagnostic of recordDiagnostics) {
      diagnostics.push(diagnostic)
      this.#report(diagnostic)
    }
    if (cache && key) {
      await cache.write(key, {
        schemaVersion: METRO_RECORD_CACHE_VERSION,
        sourceHash,
        imports,
        requireSpecifiers,
        diagnostics: recordDiagnostics,
      } satisfies CachedRecord)
    }
    return {
      // The graph and plans operate on raw source: workers apply plan edits to
      // the raw module before their own Babel pass, so plans never depend on
      // this process's Babel output matching the workers' byte for byte.
      input: { id, source, imports },
      sourceHash,
      requireSpecifiers,
    }
  }

  #babelOptions(options: MetroCompilerScanOptions): MetroBabelTransformArgs['options'] {
    const transformer = this.config.transformer ?? {}
    return {
      ...options.transform,
      dev: options.dev,
      hot: options.hot,
      platform: options.platform,
      projectRoot: this.config.projectRoot,
      enableBabelRCLookup: transformer.enableBabelRCLookup ?? true,
      enableBabelRuntime: transformer.enableBabelRuntime ?? true,
      hermesParser: transformer.hermesParser ?? false,
      publicPath: transformer.publicPath ?? '/assets',
    }
  }

  #babelArgs(
    filename: string,
    src: string,
    options: MetroCompilerScanOptions
  ): MetroBabelTransformArgs {
    return { filename, src, plugins: [], options: this.#babelOptions(options) }
  }

  async #addDependency(
    id: ResolvedModuleId,
    options: MetroCompilerScanOptions,
    diagnostics: MetroCompilerDiagnostic[],
    visiting = new Set<ResolvedModuleId>()
  ): Promise<void> {
    if (this.#records.has(id) || visiting.has(id)) return
    visiting.add(id)
    try {
      const record = await this.#compileRecord(id, options, diagnostics)
      for (const dependency of record.input.imports) {
        if (!dependency.external && isCompilerSourceFile(dependency.resolvedId)) {
          await this.#addDependency(dependency.resolvedId, options, diagnostics, visiting)
        }
      }
      this.#records.set(id, record)
      const invalidation = this.#graph?.updateModule(record.input)
      for (const affected of invalidation?.invalidatedIds ?? [id]) {
        await this.#refreshEntry(affected)
      }
      if (
        this.config.watch !== false &&
        this.#scanOptions &&
        retainsLiveGraph(this.#scanOptions)
      ) {
        this.#watchModule(id)
      }
    } finally {
      visiting.delete(id)
    }
  }

  async #refreshEntry(id: ResolvedModuleId): Promise<void> {
    const graph = this.#graph
    const host = this.#host
    const registry = this.#registry
    const record = this.#records.get(id)
    if (
      !graph ||
      !host ||
      !registry ||
      !record ||
      !this.#scanOptions ||
      !this.#projectGeneration
    ) {
      return
    }
    const target = compilerTarget(this.#scanOptions.platform)
    const materialized = materializeModule(graph, id)
    // Metro has no module runner; packages a file uses that are not in
    // `components` evaluate under the static-evaluation require hooks, once
    await this.#discovery.prepare(materialized, registry, ({ id: moduleId }) =>
      Static.evaluateComponentModule(
        { ...this.config.tamaguiOptions, platform: target },
        moduleId
      )
    )
    const plan = lowerModule({
      module: materialized,
      source: record.input.source,
      target,
      host,
      options: { projectGeneration: this.#projectGeneration },
    })
    // Zero-mode reference erasure rides the same plan. Metro fixes a module's
    // dependencies at resolution time and does no export-level shaking, so the
    // plan a worker applies before Babel is the only point early enough to
    // remove an import from the graph.
    const zeroPlan = this.#zeroPlanFor(id, record.input.source, plan)
    this.#entries.set(id, this.#entryFor(id, record, zeroPlan ?? plan))
  }

  /**
   * One plan becomes one cache entry the same way whether the plan was just
   * lowered or read back off disk, so a restored build reports exactly the
   * diagnostics a fresh one did.
   */
  #entryFor(
    id: ResolvedModuleId,
    record: CompiledRecord,
    plan: LoweredModulePlan
  ): MetroCompilerCacheEntry {
    return {
      schemaVersion: METRO_COMPILER_CACHE_VERSION,
      moduleId: id,
      sourceHash: record.sourceHash,
      plan,
      diagnostics: plan.diagnostics.map(
        ({ code, message, dependencyId, span, component }) => {
          const { line, column } = Static.offsetToLineColumn(
            record.input.source,
            span.start
          )
          return metroDiagnostic(
            code.startsWith('linked/')
              ? 'metro/resolve-failed'
              : 'metro/transform-failed',
            message,
            { moduleId: id, dependency: dependencyId, span, line, column, component }
          )
        }
      ),
    }
  }

  /**
   * Both per-file caches for this scan. A project with no content stamp gets
   * neither: a stamp that cannot see a config change would serve styles built
   * against the old config, so the answer is no cache rather than a partial one.
   *
   * Zero builds opt out of the plan cache because a zero plan is produced
   * alongside side effects that do not travel in the plan - the CSS artifact,
   * the bridge manifest, the violation list - so replaying one module's plan
   * without them would emit an artifact missing its rules.
   */
  #installCaches(
    options: MetroCompilerScanOptions,
    project: MetroCompilerProject,
    projectSourcesHash: string
  ): void {
    const platform = options.platform ?? 'default'
    const root = defaultPlanCacheRoot(this.config.projectRoot, platform)
    this.#recordCache = new JsonFileCache(
      join(root, 'records'),
      METRO_RECORD_CACHE_VERSION
    )
    this.#recordCacheIdentity = contentHash(
      stableStringify({
        schema: METRO_RECORD_CACHE_VERSION,
        resolver: this.#resolver.version,
        babel: userBabelCacheKey(this.config.originalBabelTransformerPath),
        // resolutions depend on which files exist, so the walked source list is
        // part of a record's identity exactly as it is for the plan manifest
        projectSourcesHash,
        platform,
        transform: this.#babelOptions(options),
      })
    )
    const stamp = project.cacheStamp
    const usePlanCache = typeof stamp === 'string' && stamp !== '' && !this.config.zero
    this.#planCache = usePlanCache ? new ModulePlanCache(join(root, 'plans')) : null
    this.#planCacheStamp = usePlanCache ? stamp : null
  }

  /**
   * Fills `#entries` from disk for every module whose whole compile input is
   * unchanged, and returns the ids that still have to be compiled. This is the
   * per-file property: one edited module leaves every other module's entry
   * valid, where the plan manifest would have discarded all of them.
   */
  async #restorePlans(options: MetroCompilerScanOptions): Promise<ResolvedModuleId[]> {
    this.#planKeys.clear()
    const cache = this.#planCache
    const stamp = this.#planCacheStamp
    if (!cache || !stamp) return [...this.#records.keys()].sort(compareCodeUnits)
    const target = compilerTarget(options.platform)
    const identity = {
      stamp,
      target,
      structuralPassHash: `${target}-noop-v1`,
    }
    const nodes = new Map<ResolvedModuleId, ModuleClosureNode | null>()
    const lookup = (id: ResolvedModuleId): ModuleClosureNode | null => {
      let node = nodes.get(id)
      if (node === undefined) {
        const record = this.#records.get(id)
        node = record
          ? moduleClosureNode(record.input, { includeExternal: true })
          : this.#externalClosure(id)
        nodes.set(id, node)
      }
      return node
    }
    const memo = new Map<ResolvedModuleId, string | null>()
    const unplanned: ResolvedModuleId[] = []
    for (const id of [...this.#records.keys()].sort(compareCodeUnits)) {
      const record = this.#records.get(id)!
      const digest = moduleClosureDigest(id, lookup, memo)
      const key = digest && planCacheKey(identity, id, digest)
      const entry = key && digest ? await cache.read(key, id, digest) : null
      if (entry) {
        this.#entries.set(id, this.#entryFor(id, record, entry.plan))
        continue
      }
      if (key && digest) this.#planKeys.set(id, { key, digest })
      unplanned.push(id)
    }
    return unplanned
  }

  async #storePlans(ids: readonly ResolvedModuleId[]): Promise<void> {
    const cache = this.#planCache
    if (!cache) return
    const pending = ids.flatMap((id) => {
      const entry = this.#entries.get(id)
      const key = this.#planKeys.get(id)
      return entry && key ? [{ id, entry, key }] : []
    })
    // a first build writes one file per module, and doing that serially costs
    // seconds on a real project
    for (let index = 0; index < pending.length; index += 32) {
      await Promise.all(
        pending.slice(index, index + 32).map(({ id, entry, key }) =>
          cache.write(key.key, {
            schemaVersion: PLAN_CACHE_SCHEMA_VERSION,
            moduleId: id,
            closureDigest: key.digest,
            plan: entry.plan,
          })
        )
      )
    }
  }

  /** Modules reachable from the bundle's entry, over the frontend's own graph. */
  #reachableFrom(roots: readonly ResolvedModuleId[]): Set<ResolvedModuleId> {
    const reached = new Set<ResolvedModuleId>()
    const queue = [...roots]
    while (queue.length) {
      const id = queue.pop()!
      if (reached.has(id)) continue
      reached.add(id)
      for (const dependency of this.#records.get(id)?.input.imports ?? []) {
        if (!dependency.external) queue.push(dependency.resolvedId)
      }
    }
    return reached
  }

  /**
   * The zero transform for one module, returning a plan whose edits also carry
   * the static Theme lowering, the island bridge, and reference erasure.
   */
  #zeroPlanFor(
    id: ResolvedModuleId,
    source: string,
    plan: ReturnType<typeof lowerModule>
  ): ReturnType<typeof lowerModule> | null {
    const zero = this.config.zero
    const config = this.#tamaguiConfig
    if (!zero || !config) return null

    // An island build is a full-runtime graph: it contributes its compiler
    // atomic CSS to the one artifact and is never erased or judged.
    if (zero.islandBuild) {
      zero.artifact.setIslandModuleCSS(zero.islandBuild, id, plan.css)
      return null
    }

    if (this.#zeroEntryGraph && !this.#zeroEntryGraph.has(id)) return null
    // only app-authored modules: a workspace dependency resolves outside
    // node_modules here, and erasing Tamagui's own re-exports would break it
    const relativePath = relative(this.config.projectRoot, id)
    if (
      relativePath === '' ||
      relativePath.startsWith('..') ||
      relativePath.split(/[\\/]/).includes('node_modules')
    ) {
      return null
    }

    const result = Static.transformZeroModule({
      mode: zero.isEnforcing ? 'enforce' : 'report',
      id,
      root: this.config.projectRoot,
      source,
      plan,
      config,
      isTamaguiSpecifier,
      resolveIslandLoader: (specifier) => {
        const islandId = zero.loaderIds.get(zeroModuleKey(resolve(id, '..', specifier)))
        return islandId ? { islandId } : null
      },
      resolveIslandModule: (specifier) =>
        zero.islandModuleIds.get(zeroModuleKey(resolve(id, '..', specifier))) ?? null,
    })

    zero.transformed.add(id)
    if (result.erased.exports.length) {
      zero.erasedExports.set(id, result.erased.exports)
    }
    for (const violation of result.violations) {
      const { line, column } = Static.offsetToLineColumn(source, violation.span.start)
      zero.violations.push({
        file: relativePath,
        line,
        column,
        rule: violation.rule,
        code: violation.code,
        component: violation.component,
        message: violation.message,
      })
    }
    if (result.violations.length || !zero.isEnforcing) return null

    Static.mergeIslandBridges(zero.bridges, result.bridges)
    for (const [identifier, rules] of result.bridgeCSS) {
      zero.artifact.setBridgeRules(identifier, rules)
    }
    zero.artifact.setZeroModuleCSS(id, plan.css)
    return { ...plan, edits: [...plan.edits, ...result.edits] }
  }

  async #publish(platform: string | null): Promise<string> {
    const cache = new MetroCompilerCache(this.cacheRootFor(platform))
    const generation = await cache.publish(
      platform,
      [...this.#entries.values()],
      this.#scanOptionsHash ?? ''
    )
    const zero = this.config.zero
    if (zero && !zero.islandBuild) {
      // the plans and the artifact are the same scan's output, so they are
      // published together or the warm path has nothing safe to reuse
      await cache.publishZeroCSS({
        schemaVersion: METRO_COMPILER_CACHE_VERSION,
        generation,
        configCSS: zero.configCSS,
        zeroModuleCSS: Object.fromEntries(zero.artifact.zeroModuleEntries()),
        bridgeCSS: Object.fromEntries(zero.artifact.bridgeEntries()),
        bridges: Object.fromEntries(zero.bridges),
      })
    }
    this.#publishedGeneration = generation
    return generation
  }

  /**
   * Restores the zero build's CSS side effects from the sidecar published with
   * this plan generation. Returns false when there is nothing trustworthy to
   * restore, which sends the caller to a full scan.
   */
  async #rehydrateZeroCSS(cache: MetroCompilerCache, generation: string) {
    const zero = this.config.zero
    if (!zero || zero.islandBuild) return true
    const sidecar = await cache.readZeroCSS(generation)
    if (!sidecar) return false
    zero.artifact.clearGraphs()
    zero.bridges.clear()
    zero.violations.length = 0
    zero.configCSS = sidecar.configCSS
    for (const [moduleId, css] of Object.entries(sidecar.zeroModuleCSS)) {
      zero.artifact.setZeroModuleCSS(moduleId, css)
    }
    for (const [bridgeId, css] of Object.entries(sidecar.bridgeCSS)) {
      zero.artifact.setBridgeRules(bridgeId, css)
    }
    for (const [islandId, bridges] of Object.entries(sidecar.bridges)) {
      zero.bridges.set(islandId, bridges as IslandThemeBridge[])
    }
    zero.plansRestoredFromCache = true
    return true
  }

  #installWatchers(): void {
    for (const id of this.#records.keys()) this.#watchModule(id)
  }

  #watchModule(id: ResolvedModuleId): void {
    if (this.#watchers.has(id)) return
    try {
      const watcher = watch(id, { persistent: false }, () => {
        void this.updateFile(id)
      })
      watcher.unref()
      this.#watchers.set(id, watcher)
    } catch {
      // A concurrent delete is handled by the importer's next invalidation.
    }
  }

  #report(diagnostic: MetroCompilerDiagnostic): void {
    this.config.reportDiagnostic?.(diagnostic)
  }
}

export function describeMetroCompilerRoot(projectRoot: string, moduleId: string): string {
  const path = relative(projectRoot, moduleId)
  return path.startsWith('..') ? basename(moduleId) : path
}
