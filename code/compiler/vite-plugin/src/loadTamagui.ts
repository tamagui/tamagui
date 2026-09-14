import Static from '@tamagui/static'
import type { TamaguiProjectInfo } from '@tamagui/static'
import type { TamaguiOptions } from '@tamagui/types'
import { createRequire } from 'node:module'
import path from 'node:path'
import { runnerImport, type RunnableDevEnvironment } from 'vite'

export const TAMAGUI_EVALUATION_ENVIRONMENT = 'tamagui'

/**
 * Evaluate tamagui.build.ts through Vite instead of esbuild.
 *
 * The esbuild path spawns a long-lived service process, and that process does
 * not survive a Vite dev server restart: the next `tamaguiPlugin()` call, which
 * happens while Vite is rebuilding its config, hits `write EPIPE` and takes the
 * restart down with it. Vite is already running here and already evaluates
 * tamagui.config.ts and every component package through its own module runner,
 * so the build file has no reason to need a second toolchain.
 *
 * `runnerImport` forces `configFile: false`, so loading the build file from
 * inside a plugin that the config file itself creates cannot recurse. Bare
 * imports stay external, matching esbuild's `packages: 'external'`, and the
 * returned dependency list replaces the metafile's inputs for watching.
 */
export const viteBuildConfigLoader: Static.BuildConfigLoader = async (
  absolutePath,
  root
) => {
  const { module, dependencies } = await runnerImport<Record<string, unknown>>(
    absolutePath,
    { root }
  )
  // runnerImport reports what the entry pulled in but not the entry itself,
  // where esbuild's metafile listed it. the build file is the one thing that
  // must invalidate the config, so put it back.
  return { exports: module, dependencies: [absolutePath, ...dependencies] }
}

const requireFromLoader = createRequire(
  typeof __filename === 'string' ? __filename : import.meta.url
)

// upgrading the plugin must invalidate cached plans even when the project did
// not change
const vitePluginVersions = [
  `@tamagui/vite-plugin@${(requireFromLoader('@tamagui/vite-plugin/package.json') as { version: string }).version}`,
]

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
  getTamaguiConfig(): Promise<TamaguiProjectInfo['tamaguiConfig']>
  getCompilerProject(): Promise<Static.CompilerProject>
  getEvaluationDependencies(): string[]
  isEvaluationDependency(id: string): boolean
  evaluateProjectModules(options: TamaguiOptions): Promise<EvaluatedProjectModules>
  /**
   * Evaluate one host-resolved module in the evaluation environment for the
   * compiler's component discovery. Null when the environment is not ready or
   * the module cannot run in node; the compiler then leaves its elements alone.
   */
  evaluateModule(id: string): Promise<Record<string, unknown> | null>
  loadTamaguiBuildConfig(): Promise<TamaguiOptions>
  setEnvironment(next: RunnableDevEnvironment, options?: { owned?: boolean }): void
  invalidate(file?: string): void
  ensureFullConfigLoaded(): Promise<string[]>
  cleanup(): Promise<void>
}

export function createViteTamaguiLoader(
  optionsIn: Partial<TamaguiOptions> = {}
): ViteTamaguiLoader {
  let environment: RunnableDevEnvironment | null = null
  let ownsEnvironment = false
  let loadPromise: Promise<TamaguiOptions> | null = null
  let loadedOptions: TamaguiOptions | null = null
  let projectPromise: Promise<Static.CompilerProject> | null = null
  let loadingProject: Promise<Static.CompilerProject> | null = null
  const invalidatedFiles = new Set<string>()
  const evaluationDependencies = new Set<string>()
  const stampSources = new Set<string>()
  let generation = 0

  const normalizeDependency = (id: string) => id.split('?')[0]

  const captureEvaluationDependencies = (modules: ResolvedEvaluationModule[]) => {
    evaluationDependencies.clear()
    stampSources.clear()
    for (const { id } of modules) {
      const dependency = normalizeDependency(id)
      if (path.isAbsolute(dependency)) {
        evaluationDependencies.add(dependency)
        stampSources.add(dependency)
      }
    }
    if (environment) {
      for (const module of environment.runner.evaluatedModules.urlToIdModuleMap.values()) {
        const dependency = normalizeDependency(module.file)
        if (!path.isAbsolute(dependency)) continue
        // watching node_modules is pointless, but the compile cache stamp has to
        // see them: a component package defines every staticConfig the compiler
        // lowers against, so bumping one in place must invalidate cached plans
        stampSources.add(dependency)
        if (!dependency.includes('/node_modules/')) {
          evaluationDependencies.add(dependency)
        }
      }
    }
  }

  const loadTamaguiBuildConfig = async (): Promise<TamaguiOptions> => {
    if (loadedOptions) return loadedOptions
    if (loadPromise) return loadPromise

    const pending = Static.loadTamaguiBuildConfigAsync(
      { ...optionsIn, platform: 'web' },
      viteBuildConfigLoader
    ).then(
      (options) => {
        loadedOptions = options
        return options
      },
      (error) => {
        // a build file that failed to evaluate is usually mid-edit. dropping the
        // promise lets the next caller try again instead of every later load in
        // this process replaying the first failure.
        if (loadPromise === pending) loadPromise = null
        throw error
      }
    )
    loadPromise = pending

    return pending
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

  const loadProject = async (
    options: TamaguiOptions
  ): Promise<Static.CompilerProject> => {
    if (projectPromise) return projectPromise

    const previous = loadingProject
    const projectGeneration = generation
    const changedFiles = [...invalidatedFiles]
    invalidatedFiles.clear()
    projectPromise = (async () => {
      // evaluations and their artifact writes have one owner across generations.
      // a repaired edit runs after the failed generation has finished reporting.
      try {
        await previous
      } catch {}
      if (!environment) {
        throw new Error(
          `Cannot load Tamagui without the ${TAMAGUI_EVALUATION_ENVIRONMENT} Vite environment`
        )
      }

      for (const file of changedFiles) {
        const evaluated = environment.runner.evaluatedModules
        const affected = new Set(evaluated.getModulesByFile(file))
        // invalidate importers, retaining unrelated modules and their singletons.
        for (const module of affected) {
          for (const importer of module.importers) {
            const parent = evaluated.getModuleById(importer)
            if (parent) affected.add(parent)
          }
          evaluated.invalidateModule(module)
        }
      }

      let evaluated: EvaluatedProjectModules | null = null
      return Static.loadCompilerProject({
        root: environment.config.root,
        target: 'web',
        options,
        generation: `vite:${projectGeneration}`,
        hostVersions: vitePluginVersions,
        async load(normalizedOptions) {
          evaluated = await evaluateProjectModules(normalizedOptions)
          return Static.loadTamaguiFromModules(normalizedOptions, {
            config: evaluated.config.module,
            components: evaluated.components.map(({ moduleName, module }) => ({
              moduleName,
              module,
            })),
            stampSources: [...stampSources],
          })
        },
        async resolveComponents(moduleNames) {
          if (!evaluated) {
            throw new Error('The Tamagui compiler project modules were not evaluated')
          }
          const byName = new Map(
            evaluated.components.map(({ moduleName, id }) => [moduleName, id])
          )
          return moduleNames.map((moduleName) => {
            const id = byName.get(moduleName)
            if (!id) throw new Error(`Unable to resolve compiler component ${moduleName}`)
            return { moduleName, id }
          })
        },
      })
    })()

    loadingProject = projectPromise
    const pending = projectPromise
    try {
      return await pending
    } catch (error) {
      if (projectPromise === pending) projectPromise = null
      throw error
    } finally {
      if (loadingProject === pending) loadingProject = null
    }
  }

  return {
    getEnvironment: () => environment,
    getGeneration: () => generation,
    getLoadPromise: () => loadPromise,
    getTamaguiOptions: () => loadedOptions,
    async getTamaguiConfig() {
      const options = await loadTamaguiBuildConfig()
      if (options.disable) return null
      return (await loadProject(options)).projectInfo.tamaguiConfig
    },
    async getCompilerProject() {
      const options = await loadTamaguiBuildConfig()
      return loadProject(options)
    },
    getEvaluationDependencies: () => [...evaluationDependencies],
    isEvaluationDependency: (id: string) =>
      evaluationDependencies.has(normalizeDependency(id)),
    evaluateProjectModules,
    async evaluateModule(id) {
      if (!environment) return null
      try {
        return (await environment.runner.import(id)) as Record<string, unknown>
      } catch (error) {
        if (process.env.DEBUG === 'tamagui') {
          console.info(`[tamagui] component discovery skipped ${id}:`, error)
        }
        return null
      }
    },
    loadTamaguiBuildConfig,

    setEnvironment(next: RunnableDevEnvironment, options?: { owned?: boolean }) {
      if (environment === next) return
      environment = next
      ownsEnvironment = options?.owned === true
      generation++
      projectPromise = null
    },

    invalidate(file?: string) {
      if (file) invalidatedFiles.add(normalizeDependency(file))
      generation++
      projectPromise = null
    },

    async ensureFullConfigLoaded() {
      const options = await loadTamaguiBuildConfig()
      if (!options.disable) {
        await loadProject(options)
      }
      return [...evaluationDependencies]
    },

    async cleanup() {
      try {
        await loadingProject?.catch(() => {})
        if (ownsEnvironment && environment) {
          await environment.close()
        }
      } finally {
        environment = null
        ownsEnvironment = false
        loadPromise = null
        loadedOptions = null
        projectPromise = null
        loadingProject = null
        invalidatedFiles.clear()
        evaluationDependencies.clear()
        stampSources.clear()
      }
    },
  }
}
