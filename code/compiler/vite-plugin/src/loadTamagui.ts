import Static from '@tamagui/static'
import type { ExtractedResponse, Extractor, TamaguiProjectInfo } from '@tamagui/static'
import type { TamaguiOptions } from '@tamagui/types'
import path from 'node:path'
import type { RunnableDevEnvironment } from 'vite'

export const TAMAGUI_EVALUATION_ENVIRONMENT = 'tamagui'

type ResolvedEvaluationModule = {
  moduleName: string
  id: string
  module: Record<string, unknown>
}

type EvaluatedProjectModules = {
  config: ResolvedEvaluationModule
  components: ResolvedEvaluationModule[]
}

export type ViteTamaguiLoader = {
  getEnvironment(): RunnableDevEnvironment | null
  getGeneration(): number
  getLoadPromise(): Promise<TamaguiOptions> | null
  getTamaguiOptions(): TamaguiOptions | null
  getEvaluationDependencies(): string[]
  isEvaluationDependency(id: string): boolean
  evaluateProjectModules(options: TamaguiOptions): Promise<EvaluatedProjectModules>
  loadTamaguiBuildConfig(): Promise<TamaguiOptions>
  setEnvironment(next: RunnableDevEnvironment, options?: { owned?: boolean }): void
  invalidate(file?: string): void
  ensureFullConfigLoaded(): Promise<string[]>
  extractToClassNames(params: {
    source: string
    sourcePath: string
    options: TamaguiOptions
    shouldPrintDebug: boolean | 'verbose'
  }): Promise<ExtractedResponse | null>
  cleanup(): Promise<void>
}

export function createViteTamaguiLoader(
  optionsIn: Partial<TamaguiOptions> = {}
): ViteTamaguiLoader {
  let environment: RunnableDevEnvironment | null = null
  let ownsEnvironment = false
  let loadPromise: Promise<TamaguiOptions> | null = null
  let loadedOptions: TamaguiOptions | null = null
  let projectPromise: Promise<TamaguiProjectInfo> | null = null
  let extractor: Extractor | null = null
  const evaluationDependencies = new Set<string>()
  let generation = 0

  const normalizeDependency = (id: string) => id.split('?')[0]

  const captureEvaluationDependencies = (modules: ResolvedEvaluationModule[]) => {
    for (const { id } of modules) {
      const dependency = normalizeDependency(id)
      if (path.isAbsolute(dependency)) {
        evaluationDependencies.add(dependency)
      }
    }
    if (environment) {
      for (const module of environment.runner.evaluatedModules.urlToIdModuleMap.values()) {
        const dependency = normalizeDependency(module.file)
        if (path.isAbsolute(dependency) && !dependency.includes('/node_modules/')) {
          evaluationDependencies.add(dependency)
        }
      }
    }
  }

  const loadTamaguiBuildConfig = async (): Promise<TamaguiOptions> => {
    if (loadedOptions) return loadedOptions
    if (loadPromise) return loadPromise

    loadPromise = Static.loadTamaguiBuildConfigAsync({
      ...optionsIn,
      platform: 'web',
    }).then((options) => {
      loadedOptions = options
      return options
    })

    return loadPromise
  }

  const resolveAndImport = async (
    moduleName: string,
    root: string,
    kind: 'config' | 'component'
  ): Promise<ResolvedEvaluationModule> => {
    if (!environment) {
      throw new Error(
        `The Tamagui Vite evaluation environment is not ready. Config and component evaluation requires Vite's ModuleRunner.`
      )
    }

    const source = path.isAbsolute(moduleName)
      ? moduleName
      : kind === 'config' || moduleName.startsWith('.')
        ? path.resolve(root, moduleName)
        : moduleName
    let environmentResolution = await environment.pluginContainer.resolveId(source)

    // Config paths are app-root relative by default, but package/alias config
    // entries remain supported when no root-relative file resolves.
    if (!environmentResolution && kind === 'config' && source !== moduleName) {
      environmentResolution = await environment.pluginContainer.resolveId(moduleName)
    }

    const resolvedId = environmentResolution?.id

    if (!resolvedId) {
      throw new Error(
        `Unable to resolve ${moduleName} in the Tamagui Vite environment (plugins: ${environment.plugins.map((plugin) => plugin.name).join(', ')})`
      )
    }

    return {
      moduleName,
      id: resolvedId,
      module: (await environment.runner.import(resolvedId)) as Record<string, unknown>,
    }
  }

  const evaluateProjectModules = async (
    options: TamaguiOptions
  ): Promise<EvaluatedProjectModules> => {
    if (!environment) {
      throw new Error(
        `Cannot evaluate Tamagui without the ${TAMAGUI_EVALUATION_ENVIRONMENT} Vite environment`
      )
    }

    const root = environment.config.root
    const config = await resolveAndImport(
      options.config || 'tamagui.config.ts',
      root,
      'config'
    )
    const components = await Promise.all(
      (options.components || []).map((name) => resolveAndImport(name, root, 'component'))
    )

    captureEvaluationDependencies([config, ...components])

    return { config, components }
  }

  const loadProject = async (options: TamaguiOptions): Promise<TamaguiProjectInfo> => {
    if (projectPromise) return projectPromise

    projectPromise = (async () => {
      if (!environment) {
        throw new Error(
          `Cannot load Tamagui without the ${TAMAGUI_EVALUATION_ENVIRONMENT} Vite environment`
        )
      }

      const evaluated = await evaluateProjectModules({
        ...options,
        components: [...new Set(['@tamagui/core', ...(options.components || [])])],
      })

      return Static.loadTamaguiFromModules(options, {
        config: evaluated.config.module,
        components: evaluated.components.map(({ moduleName, module }) => ({
          moduleName,
          module,
        })),
      })
    })()

    return projectPromise
  }

  const getExtractor = () => {
    return (extractor ||= Static.createExtractor({
      platform: 'web',
      loadTamagui: loadProject,
      loadTamaguiSync: false,
    }))
  }

  return {
    getEnvironment: () => environment,
    getGeneration: () => generation,
    getLoadPromise: () => loadPromise,
    getTamaguiOptions: () => loadedOptions,
    getEvaluationDependencies: () => [...evaluationDependencies],
    isEvaluationDependency: (id: string) =>
      evaluationDependencies.has(normalizeDependency(id)),
    evaluateProjectModules,
    loadTamaguiBuildConfig,

    setEnvironment(next: RunnableDevEnvironment, options?: { owned?: boolean }) {
      if (environment === next) return
      environment = next
      ownsEnvironment = options?.owned === true
      generation++
      projectPromise = null
      extractor = null
    },

    invalidate(file?: string) {
      if (file && environment) {
        environment.runner.clearCache()
      }
      generation++
      projectPromise = null
      extractor = null
    },

    async ensureFullConfigLoaded() {
      const options = await loadTamaguiBuildConfig()
      if (!options.disable) {
        await loadProject(options)
      }
      return [...evaluationDependencies]
    },

    async extractToClassNames(params: {
      source: string
      sourcePath: string
      options: TamaguiOptions
      shouldPrintDebug: boolean | 'verbose'
    }): Promise<ExtractedResponse | null> {
      return Static.extractToClassNames({
        extractor: getExtractor(),
        ...params,
      })
    },

    async cleanup() {
      try {
        if (ownsEnvironment && environment) {
          await environment.close()
        }
      } finally {
        environment = null
        ownsEnvironment = false
        loadPromise = null
        loadedOptions = null
        projectPromise = null
        extractor = null
      }
    },
  }
}
