import { watch, type FSWatcher } from 'node:fs'
import { readFile, readdir, realpath } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { basename, join, relative, resolve } from 'node:path'

import {
  ProjectGraph,
  lowerModule,
  materializeModule,
  resolvedModuleId,
  yukuFactory,
  type CompilerLoweringHost,
  type CompilerTarget,
  type HostModuleInput,
  type HostResolvedImport,
  type ResolvedModuleId,
} from '@tamagui/compiler-core'
import { createTamaguiCompilerHost, loadTamagui } from '@tamagui/static'
import type { TamaguiOptions, TamaguiProjectInfo } from '@tamagui/static'

import { compileWithUserBabel, type MetroBabelTransformArgs } from './babel'
import {
  METRO_COMPILER_CACHE_VERSION,
  MetroCompilerCache,
  defaultMetroCompilerCacheRoot,
  metroCompilerContentHash,
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

export interface MetroCompilerFrontendConfig extends MetroResolverConfig {
  cacheRoot?: string
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

export interface MetroCompilerProject {
  projectInfo: TamaguiProjectInfo
  componentModules: { moduleName: string; id: string }[]
  generation: string
  experimentalNativeFastPath?: boolean
}

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
  return metroCompilerContentHash(
    JSON.stringify({ options, projectGeneration, projectSourcesHash })
  )
}

// Metro entries can live inside node_modules (expo-router's entry reaches app
// source only through require.context), so reachability from the entry alone
// discovers nothing there. Project source is walked directly and seeded into
// the scan alongside the entry; imports then extend the graph outside the
// project root (workspace packages) exactly as before. Build output and
// platform scaffolding are pruned: they hold no authored JSX, and seeding
// compiled artifacts by walk would plan files nothing imports.
const walkExcludedDirs = new Set([
  'node_modules',
  'ios',
  'android',
  'dist',
  'build',
  'coverage',
  'types',
  'web-build',
])

async function walkProjectSources(root: string): Promise<string[]> {
  const found: string[] = []
  const stack = [root]
  while (stack.length) {
    const dir = stack.pop()!
    let entries
    try {
      entries = await readdir(dir, { withFileTypes: true })
    } catch {
      continue
    }
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue
      const path = join(dir, entry.name)
      if (entry.isDirectory()) {
        if (!walkExcludedDirs.has(entry.name)) stack.push(path)
      } else if (entry.isFile() && isCompilerSourceFile(path)) {
        found.push(path)
      }
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
  #projectGeneration: string | null = null
  #publishedGeneration: string | null = null
  #scanOptions: MetroCompilerScanOptions | null = null
  #scanOptionsHash: string | null = null
  #operationQueue: Promise<void> = Promise.resolve()

  constructor(readonly config: MetroCompilerFrontendConfig) {
    this.#cacheBaseRoot =
      config.cacheRoot ?? defaultMetroCompilerCacheRoot(config.projectRoot)
    this.#resolver = createMetroCompilerResolver(config)
  }

  get metroResolverVersion(): string {
    return this.#resolver.version
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
    this.#scanOptionsHash = scanOptionsHash(
      options,
      compilerProject.generation,
      metroCompilerContentHash(JSON.stringify(projectSources))
    )
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

    this.#graph = new ProjectGraph(yukuFactory, {
      modules: [...this.#records.values()].map(({ input }) => input),
    })
    if (
      !compilerProject.projectInfo.tamaguiConfig ||
      !compilerProject.projectInfo.components
    ) {
      throw new Error('Metro compiler project has no Tamagui config or components')
    }
    this.#host = createTamaguiCompilerHost({
      target: compilerTarget(options.platform),
      tamaguiConfig: compilerProject.projectInfo.tamaguiConfig,
      components: compilerProject.projectInfo.components,
      componentModules: compilerProject.componentModules.map(({ moduleName, id }) => ({
        moduleName,
        resolvedId: id,
      })),
      disablePartialExtraction: this.config.tamaguiOptions?.disablePartialExtraction,
      experimentalNativeFastPath: compilerProject.experimentalNativeFastPath,
    })
    this.#entries.clear()
    for (const id of this.#graph.moduleIds()) this.#refreshEntry(id)
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
    const moduleIds = this.#graph.moduleIds()
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
      metroCompilerContentHash(JSON.stringify(projectSources))
    )
    if (
      validation.valid &&
      validation.generation &&
      validation.optionsHash === optionsHash &&
      (await this.#sourcesAreFresh(validation.sourceHashes)) &&
      ((!retainsLiveGraph(options) && !this.#graph) ||
        (this.#publishedGeneration && this.#scanOptionsHash === optionsHash))
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
            if (affected !== id) this.#refreshEntry(affected)
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
      for (const affected of invalidation.invalidatedIds) this.#refreshEntry(affected)
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
        return metroCompilerContentHash(await readFile(moduleId, 'utf8')) === sourceHash
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
    this.#graph = null
    this.#host = null
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
    const projectInfo = await loadTamagui({
      ...this.config.tamaguiOptions,
      platform: target,
    })
    if (!projectInfo?.tamaguiConfig || !projectInfo.components) {
      throw new Error('Unable to load the Tamagui project for Metro compilation')
    }
    const componentModules: MetroCompilerProject['componentModules'] = []
    for (const component of projectInfo.components) {
      try {
        const resolution = this.#resolver.resolve(
          importer,
          { specifier: component.moduleName, isESMImport: true },
          options.platform
        )
        if (!resolution) continue
        componentModules.push({
          moduleName: component.moduleName,
          id: resolution.resolvedId,
        })
      } catch (error) {
        const diagnostic = metroDiagnostic(
          'metro/resolve-failed',
          `Failed to resolve compiler component ${component.moduleName}: ${error instanceof Error ? error.message : String(error)}`,
          { moduleId: importer, dependency: component.moduleName }
        )
        diagnostics.push(diagnostic)
        this.#report(diagnostic)
      }
    }
    const configCss = projectInfo.tamaguiConfig.getCSS?.() ?? ''
    const generation = metroCompilerContentHash(
      JSON.stringify({
        cacheVersion: METRO_COMPILER_CACHE_VERSION,
        compilerImplementationVersions,
        componentModules,
        configCss,
        disablePartialExtraction: !!this.config.tamaguiOptions?.disablePartialExtraction,
        experimentalNativeFastPath:
          target === 'native' &&
          this.config.tamaguiOptions?.experimental?.nativeFastPath === true,
        target,
      })
    )
    return {
      projectInfo,
      componentModules,
      generation,
      experimentalNativeFastPath:
        target === 'native' &&
        this.config.tamaguiOptions?.experimental?.nativeFastPath === true,
    }
  }

  async #compileRecord(
    rawPath: string,
    options: MetroCompilerScanOptions,
    diagnostics: MetroCompilerDiagnostic[]
  ): Promise<CompiledRecord> {
    const path = await realpath(resolve(rawPath))
    const source = await readFile(path, 'utf8')
    const args = this.#babelArgs(path, source, options)
    const compiled = await compileWithUserBabel(
      this.config.originalBabelTransformerPath,
      args
    )
    const imports: HostResolvedImport[] = []
    const requireSpecifiers: string[] = []
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
        const diagnostic = metroDiagnostic(
          'metro/resolve-failed',
          `Failed to resolve ${dependency.specifier} from ${path}: ${error instanceof Error ? error.message : String(error)}`,
          { moduleId: path, dependency: dependency.specifier }
        )
        diagnostics.push(diagnostic)
        this.#report(diagnostic)
      }
    }
    const id = resolvedModuleId(path)
    return {
      // The graph and plans operate on raw source: workers apply plan edits to
      // the raw module before their own Babel pass, so plans never depend on
      // this process's Babel output matching the workers' byte for byte.
      input: { id, source, imports },
      sourceHash: metroCompilerContentHash(source),
      requireSpecifiers,
    }
  }

  #babelArgs(
    filename: string,
    src: string,
    options: MetroCompilerScanOptions
  ): MetroBabelTransformArgs {
    const transformer = this.config.transformer ?? {}
    return {
      filename,
      src,
      plugins: [],
      options: {
        ...options.transform,
        dev: options.dev,
        hot: options.hot,
        platform: options.platform,
        projectRoot: this.config.projectRoot,
        enableBabelRCLookup: transformer.enableBabelRCLookup ?? true,
        enableBabelRuntime: transformer.enableBabelRuntime ?? true,
        hermesParser: transformer.hermesParser ?? false,
        publicPath: transformer.publicPath ?? '/assets',
      },
    }
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
        this.#refreshEntry(affected)
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

  #refreshEntry(id: ResolvedModuleId): void {
    const graph = this.#graph
    const host = this.#host
    const record = this.#records.get(id)
    if (!graph || !host || !record || !this.#scanOptions || !this.#projectGeneration)
      return
    const target = compilerTarget(this.#scanOptions.platform)
    const plan = lowerModule({
      module: materializeModule(graph, id),
      source: record.input.source,
      target,
      host,
      options: { projectGeneration: this.#projectGeneration },
    })
    const diagnostics = plan.diagnostics.map(({ code, message, dependencyId }) =>
      metroDiagnostic(
        code.startsWith('linked/') ? 'metro/resolve-failed' : 'metro/transform-failed',
        message,
        { moduleId: id, dependency: dependencyId }
      )
    )
    this.#entries.set(id, {
      schemaVersion: METRO_COMPILER_CACHE_VERSION,
      moduleId: id,
      sourceHash: record.sourceHash,
      plan,
      diagnostics,
    })
  }

  async #publish(platform: string | null): Promise<string> {
    const cache = new MetroCompilerCache(this.cacheRootFor(platform))
    const generation = await cache.publish(
      platform,
      [...this.#entries.values()],
      this.#scanOptionsHash ?? ''
    )
    this.#publishedGeneration = generation
    return generation
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
