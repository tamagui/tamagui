/**
 * The Tailwind build integration for Tamagui.
 *
 * Applications that author with `@tamagui/tailwind` change only the plugin import:
 *
 * ```ts
 * import { tamaguiPlugin } from '@tamagui/tailwind/vite'
 * ```
 *
 * This wraps the base `@tamagui/vite-plugin` compiler plugins, reuses their one
 * Tamagui config loader, adds `@tamagui/tailwind` to compiler component provenance,
 * and adds the official Tailwind scanner/compiler for the candidates Tamagui's own
 * grammar does not claim. Nothing here is reachable from the `@tamagui/tailwind`
 * root: the runtime package never imports the Tailwind engine or Vite.
 */
import {
  createTamaguiPlugins,
  type TamaguiVitePluginOptions,
  type ViteTamaguiLoader,
} from '@tamagui/vite-plugin/internal'
import path from 'node:path'
import type {
  Environment,
  Plugin,
  PluginOption,
  ResolvedConfig,
  ViteDevServer,
} from 'vite'

import {
  createTailwindScannerState,
  isTamaguiCoreResetCSS,
  TAILWIND_RESOLVED_ID,
  TAILWIND_VIRTUAL_ID,
  updateTailwindForWatchChange,
  wrapWithTamaguiLayer,
} from './vite/state'

export { TAILWIND_RESOLVED_ID, TAILWIND_VERSION, TAILWIND_VIRTUAL_ID } from './vite/state'

function isNative(environment?: Environment) {
  return environment?.name === 'ios' || environment?.name === 'android'
}

function isNotClient(environment?: Environment) {
  return !!environment?.name && environment.name !== 'client'
}

function createTailwindPlugin(loader: ViteTamaguiLoader): Plugin {
  const state = createTailwindScannerState()
  let config: ResolvedConfig
  let server: ViteDevServer | undefined

  const configure = async (addWatchFile: (file: string) => void) =>
    state.configure(
      config.root,
      loader.getGeneration(),
      await loader.getTamaguiConfig(),
      addWatchFile,
      (glob) => server?.watcher.add(glob)
    )

  const isAppJSXSource = (filePath: string) => {
    if (!/\.[jt]sx$/.test(filePath)) return false
    const relative = path.relative(config.root, filePath)
    return (
      relative !== '' &&
      relative !== '..' &&
      !relative.startsWith(`..${path.sep}`) &&
      !relative.split(path.sep).includes('node_modules')
    )
  }

  const clientTailwindModule = () =>
    server?.environments.client?.moduleGraph.getModuleById(TAILWIND_RESOLVED_ID)

  return {
    name: 'tamagui-tailwind',
    enforce: 'pre',

    config() {
      return {
        optimizeDeps: {
          // Tailwind components reach the shared renderer through
          // `@tamagui/core/internal-runtime`, while regular components reach it through
          // `@tamagui/core`. Optimizing both entries together puts them in one chunk
          // graph, so there is a single `@tamagui/web` instance and both frontends see
          // the same config singleton and contexts.
          include: ['@tamagui/tailwind', '@tamagui/core/internal-runtime'],
        },
        resolve: {
          dedupe: ['@tamagui/tailwind'],
        },
        define: {
          // Runtime-generated and SSR fallback rules must participate in the same
          // cascade order as compiler-extracted Tamagui CSS. Without this, the
          // unlayered runtime duplicate beats official Tailwind utilities.
          'process.env.TAMAGUI_CSS_LAYER': JSON.stringify('tamagui'),
        },
      }
    },

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    configureServer(_server) {
      server = _server
    },

    hotUpdate: {
      order: 'post',
      async handler(options) {
        if (this.environment.name !== 'client') return
        // a config change already triggers a full reload from the base plugin; drop the
        // scanner so the next request recompiles against the new grammar view
        if (loader.isEvaluationDependency(options.file)) {
          state.clear()
          return
        }
        if (!(await configure(() => {}))) return
        const changed =
          options.type === 'delete'
            ? await state.removeSource(options.file)
            : await state.scanSource(options.file, await options.read())
        if (!changed) return
        const virtualModule = clientTailwindModule()
        if (!virtualModule) return
        this.environment.moduleGraph.invalidateModule(virtualModule)
        return [...options.modules, virtualModule]
      },
    },

    async watchChange(id, change) {
      if (config.command !== 'build') return
      if (loader.isEvaluationDependency(id)) {
        state.clear()
        return
      }
      await updateTailwindForWatchChange(state, id, change.event, () =>
        configure((file) => this.addWatchFile(file))
      )
    },

    resolveId(source) {
      if (isNative(this.environment) || isNotClient(this.environment)) return
      if (source === TAILWIND_VIRTUAL_ID) return TAILWIND_RESOLVED_ID
    },

    async load(id) {
      if (id !== TAILWIND_RESOLVED_ID) return
      if (isNative(this.environment) || isNotClient(this.environment)) return
      if (!(await configure((file) => this.addWatchFile(file)))) return ''
      return state.css
    },

    transform: {
      order: 'pre',
      async handler(code, id) {
        if (isNative(this.environment)) return

        const [validId] = id.split('?')

        // Tamagui's reset belongs in the Tamagui layer so official Tailwind's theme
        // and utilities layers order after it
        if (isTamaguiCoreResetCSS(validId)) {
          return { code: wrapWithTamaguiLayer(code), map: null }
        }

        // the config loader needs Vite's evaluation environment, which is installed by
        // the base plugin's configureServer/buildStart
        if (!loader.getEnvironment()) return
        if (!isAppJSXSource(validId)) return
        if (!(await configure((file) => this.addWatchFile(file)))) return

        if (await state.scanSource(validId, code)) {
          const virtualModule = clientTailwindModule()
          if (virtualModule) {
            server?.environments.client?.moduleGraph.invalidateModule(virtualModule)
          }
        }
        for (const dependency of loader.getEvaluationDependencies()) {
          this.addWatchFile(dependency)
        }

        // the virtual stylesheet is a client-only import: server bundles must not
        // reference it, and it is emitted once per app module so any entry pulls it in
        if (isNotClient(this.environment)) return
        return { code: `${code}\nimport "${TAILWIND_VIRTUAL_ID}";`, map: null }
      },
    },
  }
}

export function tamaguiPlugin(options: TamaguiVitePluginOptions = {}): PluginOption {
  const { plugins, loader } = createTamaguiPlugins({
    ...options,
    components: [
      ...new Set([...(options.components ?? ['tamagui']), '@tamagui/tailwind']),
    ],
    wrapExtractedCSS: wrapWithTamaguiLayer,
  })
  return [...plugins, createTailwindPlugin(loader)]
}
