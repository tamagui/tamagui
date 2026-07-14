import { watch, type FSWatcher } from 'node:fs'
import { readFile, realpath } from 'node:fs/promises'
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
  compiledHash: string
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

function scanOptionsHash(
  options: MetroCompilerScanOptions,
  projectGeneration: string
): string {
  return metroCompilerContentHash(JSON.stringify({ options, projectGeneration }))
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
  #updateQueue: Promise<void> = Promise.resolve()

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

  async scan(options: MetroCompilerScanOptions): Promise<MetroCompilerGeneration> {
    return await this.#scan(options)
  }

  async #scan(
    options: MetroCompilerScanOptions,
    preparedProject?: MetroCompilerProject
  ): Promise<MetroCompilerGeneration> {
    this.#scanOptions = options
    this.#publishedGeneration = null
    const diagnostics: MetroCompilerDiagnostic[] = []
    const roots = (
      await Promise.all(
        options.entryFiles.map((path) => realpath(resolve(this.config.projectRoot, path)))
      )
    ).sort(compareCodeUnits)
    const compilerProject =
      preparedProject ?? (await this.#loadCompilerProject(options, roots[0], diagnostics))
    this.#projectGeneration = compilerProject.generation
    this.#scanOptionsHash = scanOptionsHash(options, compilerProject.generation)
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
    })
    this.#entries.clear()
    for (const id of this.#graph.moduleIds()) this.#refreshEntry(id)
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

  async ensureValidCache(
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
    const optionsHash = scanOptionsHash(options, compilerProject.generation)
    if (
      validation.valid &&
      validation.generation &&
      validation.optionsHash === optionsHash &&
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
    return await this.#scan(options, compilerProject)
  }

  async updateFile(path: string): Promise<MetroCompilerUpdate> {
    let result: MetroCompilerUpdate = {
      changed: false,
      affectedIds: [],
      generation: null,
    }
    const operation = this.#updateQueue
      .catch(() => {})
      .then(async () => {
        const graph = this.#graph
        const options = this.#scanOptions
        if (!graph || !options) return
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
            return
          }
          const diagnostic = metroDiagnostic(
            'metro/transform-failed',
            `Failed to update ${path}: ${error instanceof Error ? error.message : String(error)}`,
            { moduleId: path }
          )
          this.#report(diagnostic)
          return
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
      })
    this.#updateQueue = operation.catch(() => {})
    await operation
    return result
  }

  close(): void {
    this.#releaseGraph()
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
        componentModules,
        configCss,
        target,
      })
    )
    return { projectInfo, componentModules, generation }
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
    for (const dependency of moduleSpecifiersFromAst(compiled.result.ast)) {
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
      input: { id, source: compiled.code, imports },
      compiledHash: metroCompilerContentHash(compiled.code),
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
      compiledHash: record.compiledHash,
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
