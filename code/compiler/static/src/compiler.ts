import {
  CompilerSession,
  LOWERED_MODULE_PLAN_VERSION,
  ModulePlanCache,
  PLAN_CACHE_SCHEMA_VERSION,
  contentHash,
  defaultPlanCacheRoot,
  resolvedModuleId,
  stableStringify,
  yukuFactory,
  type AppliedLoweredModule,
  type CompilerTarget,
  type HostModuleInput,
  type LoweredModulePlan,
  type ResolvedModuleId,
} from '@tamagui/compiler-core'
import type { TamaguiOptions } from '@tamagui/types'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

import { ComponentDiscovery, type ComponentModuleEvaluator } from './componentDiscovery'
import { createComponentRegistry, createTamaguiCompilerHost } from './compilerHost'
import { domStructuralPass } from './domStructuralPass'
import type { TamaguiProjectInfo } from './extractor/bundleConfig'
import { loadTamagui } from './extractor/loadTamagui'
import { resolveZeroRuntimeSync } from './zero/options'

export interface CompilerProjectComponentModule {
  moduleName: string
  id: string
}

export interface CompilerProject {
  projectInfo: TamaguiProjectInfo
  componentModules: CompilerProjectComponentModule[]
  generation: string
  /** Keep elements with dynamic style props fully on the runtime path. */
  disablePartialExtraction?: boolean
  /** emit native theme-token mappings for the native style engine */
  experimentalNativeFastPath?: boolean
  /** Zero-runtime mode, which makes the host's diagnostics mode-aware. */
  zeroRuntime?: boolean
  /**
   * Content identity of everything a lowering plan depends on that is not a
   * module: the compiler build, the evaluated config and component registry,
   * the platform, and the modes. Null when the project could not name the files
   * that determine it, in which case nothing is cached to disk.
   */
  cacheStamp: string | null
}

export interface LoadCompilerProjectInput {
  root: string
  target: CompilerTarget
  options: Partial<TamaguiOptions>
  generation:
    | string
    | ((
        projectInfo: TamaguiProjectInfo,
        componentModules: CompilerProjectComponentModule[],
        options: TamaguiOptions
      ) => string)
  rebuild?: boolean
  /**
   * `name@version` for the host integration package, folded into the cache
   * stamp so a plugin upgrade cannot reuse plans built by the previous one.
   */
  hostVersions?: readonly string[]
  missingProjectMessage?: string
  load?: (options: TamaguiOptions, rebuild: boolean) => Promise<TamaguiProjectInfo | null>
  resolveComponents?: (
    moduleNames: readonly string[],
    projectInfo: TamaguiProjectInfo,
    options: TamaguiOptions
  ) => Promise<CompilerProjectComponentModule[]>
}

/**
 * normalize and load the compiler-owned project contract. module resolution and
 * evaluation stay with the adapter through the two callbacks.
 */
export async function loadCompilerProject({
  root,
  target,
  options: optionsIn,
  generation,
  rebuild = false,
  hostVersions = [],
  missingProjectMessage = 'Unable to load the Tamagui compiler project',
  load = loadTamagui,
  resolveComponents,
}: LoadCompilerProjectInput): Promise<CompilerProject> {
  const components = [
    ...new Set(['@tamagui/core', ...(optionsIn.components || ['tamagui'])]),
  ]
  const options = {
    ...optionsIn,
    root,
    platform: target,
    components,
  } as TamaguiOptions
  const zeroRuntime = resolveZeroRuntimeSync(options, root).mode
  if (zeroRuntime === 'enforce') options.outputCSS = undefined

  const projectInfo = await load(options, rebuild)
  if (!projectInfo?.tamaguiConfig || !projectInfo.components) {
    throw new Error(missingProjectMessage)
  }

  const componentModules = resolveComponents
    ? await resolveComponents(components, projectInfo, options)
    : []

  const disablePartialExtraction = !!options.disablePartialExtraction
  const experimentalNativeFastPath =
    target === 'native' && options.experimental?.nativeFastPath === true

  return {
    projectInfo,
    componentModules,
    generation:
      typeof generation === 'function'
        ? generation(projectInfo, componentModules, options)
        : generation,
    disablePartialExtraction,
    experimentalNativeFastPath,
    zeroRuntime: zeroRuntime !== 'off',
    cacheStamp: compilerProjectStamp({
      stampSources: projectInfo.stampSources ?? [],
      hostVersions,
      target,
      componentModules,
      disablePartialExtraction,
      experimentalNativeFastPath,
      zeroRuntime: zeroRuntime !== 'off',
      development: process.env.NODE_ENV === 'development',
    }),
  }
}

const requireFromCompiler = createRequire(
  typeof __filename === 'string' ? __filename : import.meta.url
)

// upgrading the compiler must invalidate cached plans even when nothing about
// the project changed
const compilerPackageVersions = ['@tamagui/compiler-core', '@tamagui/static'].map(
  (name) =>
    `${name}@${(requireFromCompiler(`${name}/package.json`) as { version: string }).version}`
)

/**
 * The non-module half of every plan cache key. Null when the project named no
 * stamp sources: a stamp that cannot see a config change is worse than no
 * cache, so that project simply does not cache.
 */
export function compilerProjectStamp(input: {
  stampSources: readonly string[]
  hostVersions: readonly string[]
  target: CompilerTarget
  componentModules: readonly CompilerProjectComponentModule[]
  disablePartialExtraction: boolean
  experimentalNativeFastPath: boolean
  zeroRuntime: boolean
  /**
   * `process.env.NODE_ENV === 'development'` in the process that builds plans.
   * The host emits debug-receipt edits into `plan.edits` only in development
   * (compilerHost.ts's developmentDebugInstrumentation), so a development plan
   * is not a plan a production build may reuse. This is the ONLY ambient input
   * to a plan, and it lives in the stamp so every host inherits it rather than
   * each one remembering to add it to its own key.
   */
  development: boolean
}): string | null {
  if (!input.stampSources.length) return null
  const sources: [string, string][] = []
  for (const file of [...new Set(input.stampSources)].sort()) {
    try {
      sources.push([file, contentHash(readFileSync(file))])
    } catch {
      // a source the project named but that is not readable makes the stamp
      // incomplete, and an incomplete stamp is what ships stale styles
      return null
    }
  }
  return contentHash(
    stableStringify({
      schema: PLAN_CACHE_SCHEMA_VERSION,
      plan: LOWERED_MODULE_PLAN_VERSION,
      packages: [...compilerPackageVersions, ...input.hostVersions].sort(),
      target: input.target,
      development: input.development,
      componentModules: input.componentModules.map(({ moduleName, id }) => [
        moduleName,
        cleanId(id),
      ]),
      disablePartialExtraction: input.disablePartialExtraction,
      experimentalNativeFastPath: input.experimentalNativeFastPath,
      zeroRuntime: input.zeroRuntime,
      sources,
    })
  )
}

export interface CompilerResolution {
  id: string
  external?: boolean
}

export interface CompilerInput {
  id: string
  source: string
  root: string
  target: CompilerTarget
  /** Host environment whose resolver produced this module graph. */
  environment?: string
  project: CompilerProject
  resolve(specifier: string, importer: string): Promise<CompilerResolution | null>
  load(id: string): Promise<string | null>
  /**
   * Evaluate a host-resolved module and return its exports. The frontend asks
   * for every package a JSX element or styled() base imports from that is not
   * in the configured `components` list, once per module per project, and
   * lowers against the static configs it finds. Return null (or throw) when
   * the host cannot evaluate the module; those elements stay on the runtime
   * path exactly as before.
   */
  evaluate?: ComponentModuleEvaluator
}

export type CompilerUpdateInput = CompilerInput

export interface CompilerResult {
  plan: LoweredModulePlan
  output: AppliedLoweredModule
  invalidatedIds: ResolvedModuleId[]
}

function cleanId(id: string): string {
  return id.split(/[?#]/, 1)[0]
}

function externalId(specifier: string): ResolvedModuleId {
  return resolvedModuleId(`external://${encodeURIComponent(specifier)}`)
}

function compilerContext(input: CompilerInput): string {
  return `${input.root}\0${input.target}\0${input.environment ?? ''}\0${input.project.generation}`
}

function sourceCanBeLinked(root: string, id: string): boolean {
  const clean = cleanId(id)
  const normalized = clean.replace(/\\/g, '/')
  if (!path.isAbsolute(clean) || normalized.includes('/node_modules/')) return false
  const relative = path.relative(root, clean)
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`))
}

/**
 * Long-lived host-resolved graph frontend. The adapter supplies every identity and
 * load result; compiler-core never guesses package, alias, or workspace resolution.
 */
export class CompilerFrontend {
  private readonly session = new CompilerSession()
  private queue: Promise<unknown> = Promise.resolve()
  private readonly planCaches = new Map<string, ModulePlanCache>()
  private readonly moduleRecords = new Map<ResolvedModuleId, HostModuleInput>()
  private moduleContext: string | null = null
  private readonly discovery = new ComponentDiscovery()

  /**
   * One cache per project root and platform. Absent when the project produced
   * no content stamp, in which case plans are never persisted rather than
   * persisted under an identity that cannot see a config change.
   */
  private planCacheFor(
    input: CompilerInput
  ): { store: ModulePlanCache; stamp: string } | undefined {
    const stamp = input.project.cacheStamp
    if (!stamp) return undefined
    const root = defaultPlanCacheRoot(input.root, input.target)
    let store = this.planCaches.get(root)
    if (!store) {
      store = new ModulePlanCache(root)
      this.planCaches.set(root, store)
    }
    return { store, stamp }
  }

  /** Hits, misses and writes across every plan cache this frontend has used. */
  get planCacheStats(): { hits: number; misses: number; writes: number } {
    const total = { hits: 0, misses: 0, writes: 0 }
    for (const store of this.planCaches.values()) {
      total.hits += store.stats.hits
      total.misses += store.stats.misses
      total.writes += store.stats.writes
    }
    return total
  }

  compile(input: CompilerInput): Promise<CompilerResult> {
    // compiling must not leak process-global state: internal stages set
    // TAMAGUI_TARGET / IS_STATIC while evaluating modules for a platform, and
    // an embedder (or a test that renders at runtime after compiling) must see
    // its own environment unchanged afterward
    const operation = this.queue.then(async () => {
      const previousTarget = process.env.TAMAGUI_TARGET
      const previousStatic = process.env.IS_STATIC
      try {
        return await this.compileNow(input)
      } finally {
        if (previousTarget === undefined) delete process.env.TAMAGUI_TARGET
        else process.env.TAMAGUI_TARGET = previousTarget
        if (previousStatic === undefined) delete process.env.IS_STATIC
        else process.env.IS_STATIC = previousStatic
      }
    })
    this.queue = operation.catch(() => undefined)
    return operation
  }

  update(input: CompilerUpdateInput): Promise<ResolvedModuleId[]> {
    const operation = this.queue.then(async () => {
      const { modules } = await this.buildTree(input)
      const invalidated = new Set<ResolvedModuleId>()
      for (const module of modules.values()) {
        for (const id of await this.session.update(module)) invalidated.add(id)
        this.moduleRecords.set(module.id, module)
      }
      return [...invalidated].sort()
    })
    this.queue = operation.catch(() => undefined)
    return operation
  }

  has(id: string): boolean {
    return this.session.has(resolvedModuleId(cleanId(id)))
  }

  dependentsOf(id: string): ResolvedModuleId[] {
    return this.session.dependentsOf(resolvedModuleId(cleanId(id)))
  }

  remove(id: string) {
    const operation = this.queue.then(async () => {
      const result = await this.session.remove(resolvedModuleId(cleanId(id)))
      for (const invalidatedId of result.invalidatedIds) {
        this.moduleRecords.delete(invalidatedId)
      }
      return result
    })
    this.queue = operation.catch(() => undefined)
    return operation
  }

  parseCount(id: string): number {
    return this.session.parseCount(resolvedModuleId(cleanId(id)))
  }

  private async compileNow(input: CompilerInput): Promise<CompilerResult> {
    const { rootModule, modules } = await this.buildTree(input)
    const invalidated = new Set<ResolvedModuleId>()
    for (const module of modules.values()) {
      for (const id of await this.session.update(module)) invalidated.add(id)
      this.moduleRecords.set(module.id, module)
    }
    const projectInfo = input.project.projectInfo
    if (!projectInfo.tamaguiConfig || !projectInfo.components) {
      throw new Error('The compiler requires evaluated Tamagui config and components')
    }
    const componentModules = input.project.componentModules.map((component) => ({
      moduleName: component.moduleName,
      resolvedId: cleanId(component.id),
    }))
    const registry = createComponentRegistry(projectInfo.components, componentModules)
    this.discovery.seed(registry)
    const host = createTamaguiCompilerHost({
      target: input.target,
      tamaguiConfig: projectInfo.tamaguiConfig,
      components: projectInfo.components,
      componentModules,
      registry,
      disablePartialExtraction: input.project.disablePartialExtraction,
      experimentalNativeFastPath: input.project.experimentalNativeFastPath,
      zeroRuntime: input.project.zeroRuntime,
    })
    const result = await this.session.compile({
      module: rootModule,
      adapter: {
        target: input.target,
        projectGeneration: input.project.generation,
        host,
        planCache: this.planCacheFor(input),
        async load(id) {
          return modules.get(id) ?? null
        },
        prepare: (module) => this.discovery.prepare(module, registry, input.evaluate),
      },
      structuralPass: domStructuralPass,
    })
    for (const id of result.invalidatedIds) invalidated.add(id)
    return {
      plan: result.plan,
      output: result.output,
      invalidatedIds: [...invalidated].sort(),
    }
  }

  /** host-resolved ids of every module discovery found components in */
  discoveredModuleIds(): string[] {
    return this.discovery.ids()
  }

  private async buildTree(input: CompilerUpdateInput): Promise<{
    rootModule: HostModuleInput
    modules: Map<ResolvedModuleId, HostModuleInput>
  }> {
    const moduleContext = compilerContext(input)
    if (this.moduleContext !== moduleContext) {
      this.moduleRecords.clear()
      this.discovery.clear()
      this.moduleContext = moduleContext
    }

    const componentBySpecifier = new Map(
      input.project.componentModules.map((component) => [
        component.moduleName,
        resolvedModuleId(cleanId(component.id)),
      ])
    )
    const modules = new Map<ResolvedModuleId, HostModuleInput>()
    const loading = new Set<ResolvedModuleId>()

    const addInstalledClosure = (module: HostModuleInput): void => {
      if (modules.has(module.id) || loading.has(module.id)) return
      loading.add(module.id)
      for (const dependency of module.imports) {
        if (dependency.external) continue
        const installedDependency = this.moduleRecords.get(dependency.resolvedId)
        if (installedDependency && this.session.has(dependency.resolvedId)) {
          addInstalledClosure(installedDependency)
        }
      }
      modules.set(module.id, module)
      loading.delete(module.id)
    }

    const loadModule = async (
      rawId: string,
      source: string
    ): Promise<HostModuleInput> => {
      const id = resolvedModuleId(cleanId(rawId))
      const existing = modules.get(id)
      if (existing) return existing
      const installed = this.moduleRecords.get(id)
      if (installed?.source === source && this.session.has(id)) {
        addInstalledClosure(installed)
        return installed
      }
      if (loading.has(id)) {
        return { id, source, imports: [] }
      }
      loading.add(id)

      const imports: HostModuleInput['imports'][number][] = []
      for (const specifier of yukuFactory.scanImports(id, source)) {
        const configuredComponent = componentBySpecifier.get(specifier)
        if (configuredComponent) {
          imports.push({ specifier, resolvedId: configuredComponent, external: true })
          continue
        }

        const resolution = await input.resolve(specifier, id)
        if (!resolution) continue
        const canLink =
          !resolution.external && sourceCanBeLinked(input.root, resolution.id)
        const resolvedId = canLink
          ? resolvedModuleId(cleanId(resolution.id))
          : path.isAbsolute(cleanId(resolution.id))
            ? resolvedModuleId(cleanId(resolution.id))
            : externalId(specifier)
        imports.push({ specifier, resolvedId, external: !canLink })
        if (canLink && !modules.has(resolvedId) && !loading.has(resolvedId)) {
          const installedDependency = this.moduleRecords.get(resolvedId)
          if (installedDependency && this.session.has(resolvedId)) {
            addInstalledClosure(installedDependency)
          } else {
            const dependencySource = await input.load(resolution.id)
            if (dependencySource !== null) {
              await loadModule(resolution.id, dependencySource)
            }
          }
        }
      }

      const module = { id, source, imports }
      modules.set(id, module)
      loading.delete(id)
      return module
    }

    const rootModule = await loadModule(input.id, input.source)
    return { rootModule, modules }
  }
}
