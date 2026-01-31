/**
 * Tamagui Vite Plugin
 *
 * Config comes from tamagui.build.ts:
 * - disableExtraction: false → full extraction to CSS with flattening (🐥 with flat counts)
 * - disableExtraction: true → just aliases/defines, babel runs for dev helpers (🐥 with 0 flat)
 */

import type { TamaguiOptions, ExtractedResponse } from '@tamagui/static-worker'
import * as Static from '@tamagui/static-worker'
import { getPragmaOptions } from '@tamagui/static-worker'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import { normalizePath, transformWithEsbuild, type Environment } from 'vite'

import {
  type CacheEntry,
  getCached,
  setCache,
  getPendingExtraction,
  setPendingExtraction,
  clearPendingExtraction,
} from './cache'
import { loadTamagui, getLoadedConfig, getConfigSync } from './loadTamagui'

const resolve = (name: string) => fileURLToPath(import.meta.resolve(name))

function isSSR(env?: Environment): boolean {
  return !!env?.name && env.name !== 'client'
}

function isNative(env?: Environment): boolean {
  return !!env?.name && (env.name === 'ios' || env.name === 'android')
}

// ─────────────────────────────────────────────────────────────────────────────
// Aliases
// ─────────────────────────────────────────────────────────────────────────────

type AliasOptions = {
  rnwLite?: boolean | 'without-animated'
  svg?: boolean
}

type AliasEntry = { find: string | RegExp; replacement: string }

export function tamaguiAliases(options: AliasOptions = {}): AliasEntry[] {
  const aliases: AliasEntry[] = []

  if (options.svg) {
    aliases.push({
      find: 'react-native-svg',
      replacement: resolve('@tamagui/react-native-svg'),
    })
  }

  if (options.rnwLite) {
    const rnwl = resolve(
      options.rnwLite === 'without-animated'
        ? '@tamagui/react-native-web-lite/without-animated'
        : '@tamagui/react-native-web-lite'
    )
    const rnwlBase = path.dirname(resolve('@tamagui/react-native-web-lite/package.json'))

    aliases.push(
      {
        find: /^react-native(?:-web)?\/dist\/(?:exports|modules)\/.*\/([^/]+)$/,
        replacement: `${rnwlBase}/dist/esm/$1.mjs`,
      },
      { find: /^react-native$/, replacement: rnwl },
      {
        find: /^react-native\/(Libraries\/Utilities\/codegenNativeComponent|Libraries\/Utilities\/codegenNativeCommand)$/,
        replacement: `${rnwlBase}/$1`,
      },
      {
        find: 'react-native/package.json',
        replacement: resolve('@tamagui/react-native-web-lite/package.json'),
      },
      { find: /^react-native-web$/, replacement: rnwl }
    )
  }

  return aliases
}

// ─────────────────────────────────────────────────────────────────────────────
// Plugin
// ─────────────────────────────────────────────────────────────────────────────

type PluginOptions = Partial<TamaguiOptions> & {
  disableResolveConfig?: boolean
}

export function tamaguiPlugin(pluginOptions: PluginOptions = {}): Plugin[] {
  const { disableResolveConfig, ...tamaguiOptionsIn } = pluginOptions

  let watcher: Promise<{ dispose: () => void } | void | undefined> | undefined

  // TODO: temporary fix for vxrn native env
  const enableNativeEnv = !!(globalThis as any).__vxrnEnableNativeEnv

  const extensions = [
    '.web.mjs',
    '.web.js',
    '.web.jsx',
    '.web.ts',
    '.web.tsx',
    '.mjs',
    '.js',
    '.mts',
    '.ts',
    '.jsx',
    '.tsx',
    '.json',
  ]

  // start loading config immediately
  loadTamagui(tamaguiOptionsIn)

  // ───────────────────────────────────────────────────────────────────────────
  // Base Plugin
  // ───────────────────────────────────────────────────────────────────────────

  const basePlugin: Plugin = {
    name: 'tamagui',
    enforce: 'pre',

    async buildEnd() {
      const w = await watcher
      w?.dispose()
    },

    async transform(code, id) {
      if (id.includes('expo-linear-gradient')) {
        return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'automatic' })
      }
    },

    async config(_, env) {
      const options = await getLoadedConfig()

      // start watching config
      if (!options.disableWatchTamaguiConfig) {
        watcher = Static.watchTamaguiConfig({
          components: ['tamagui'],
          config: './src/tamagui.config.ts',
          ...options,
        }).catch((err) => {
          console.error(` [Tamagui] Error watching config: ${err}`)
        })
      }

      return {
        envPrefix: ['TAMAGUI_'],

        environments: {
          client: {
            define: {
              'process.env.TAMAGUI_IS_CLIENT': JSON.stringify(true),
              'process.env.TAMAGUI_ENVIRONMENT': '"client"',
            },
          },
        },

        define: {
          _frameTimestamp: undefined,
          _WORKLET: false,
          __DEV__: `${env.mode === 'development'}`,
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || env.mode),
          'process.env.ENABLE_RSC': JSON.stringify(process.env.ENABLE_RSC || ''),
          'process.env.ENABLE_STEPS': JSON.stringify(process.env.ENABLE_STEPS || ''),
          'process.env.IS_STATIC': JSON.stringify(false),
          ...(env.mode === 'production' && {
            'process.env.TAMAGUI_OPTIMIZE_THEMES': JSON.stringify(true),
          }),
        },

        resolve:
          disableResolveConfig || enableNativeEnv
            ? {}
            : {
                extensions,
                alias: {
                  ...(options.platform !== 'native' && {
                    'react-native/Libraries/Renderer/shims/ReactFabric':
                      resolve('@tamagui/proxy-worm'),
                    'react-native/Libraries/Utilities/codegenNativeComponent':
                      resolve('@tamagui/proxy-worm'),
                    'react-native-svg': resolve('@tamagui/react-native-svg'),
                    ...(!options.useReactNativeWebLite && {
                      'react-native': resolve('react-native-web'),
                    }),
                  }),
                },
              },
      }
    },
  }

  // ───────────────────────────────────────────────────────────────────────────
  // RNW-Lite Plugin
  // ───────────────────────────────────────────────────────────────────────────

  const rnwLitePlugin: Plugin = {
    name: 'tamagui-rnw-lite',

    config() {
      if (enableNativeEnv) return {}

      const options = getConfigSync()
      if (!options?.useReactNativeWebLite) return {}

      return {
        resolve: {
          alias: tamaguiAliases({ rnwLite: options.useReactNativeWebLite }),
        },
      }
    },
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Extract Plugin
  // ───────────────────────────────────────────────────────────────────────────

  const cssMap = new Map<string, string>()
  const virtualExt = '.tamagui.css'
  let config: ResolvedConfig
  let server: ViteDevServer

  const getHash = (input: string) => createHash('sha1').update(input).digest('base64')

  const getAbsoluteId = (filePath: string) => {
    if (filePath.startsWith(config.root)) return filePath
    return normalizePath(path.join(config.root, filePath))
  }

  const invalidateModule = (absoluteId: string) => {
    if (!server) return
    const modules = server.moduleGraph.getModulesByFile(absoluteId)
    if (modules) {
      for (const mod of modules) {
        server.moduleGraph.invalidateModule(mod)
        mod.lastHMRTimestamp = mod.lastInvalidationTimestamp || Date.now()
      }
    }
  }

  const extractPlugin: Plugin = {
    name: 'tamagui-extract',
    enforce: 'pre',

    configureServer(s) {
      server = s
    },

    config(userConf) {
      userConf.optimizeDeps ||= {}
      userConf.optimizeDeps.include ||= []
      userConf.optimizeDeps.include.push('@tamagui/core/inject-styles')
    },

    configResolved(resolved) {
      config = resolved
    },

    resolveId(source) {
      if (isNative(this.environment)) return
      if (isSSR(this.environment)) return

      const [validId, query] = source.split('?')
      if (!validId.endsWith(virtualExt)) return

      const absoluteId = source.startsWith(config.root) ? source : getAbsoluteId(validId)

      if (cssMap.has(absoluteId)) {
        return absoluteId + (query ? `?${query}` : '')
      }
    },

    load(id) {
      if (isNative(this.environment)) return
      if (isSSR(this.environment)) return

      const options = getConfigSync()
      if (options?.disable) return

      const [validId] = id.split('?')
      return cssMap.get(validId)
    },

    transform: {
      order: 'pre',
      async handler(code, id) {
        if (isNative(this.environment)) return

        const [validId] = id.split('?')
        if (!validId.endsWith('.tsx')) return

        const options = await getLoadedConfig()

        // skip extraction if disabled
        if (options.disable || options.disableExtraction) return

        // check pragma
        const firstCommentIndex = code.indexOf('// ')
        const { shouldDisable, shouldPrintDebug } = await getPragmaOptions({
          source: firstCommentIndex >= 0 ? code.slice(firstCommentIndex) : '',
          path: validId,
        })

        if (shouldPrintDebug) {
          console.trace(`[tamagui] ${id} env=${this.environment?.name}`)
          console.info(`\n\nOriginal:\n${code}\n\n`)
        }

        if (shouldDisable) return

        // cache
        const cacheKey = getHash(`${code}${id}`)
        const isSSREnv = isSSR(this.environment)

        const formatResult = (entry: CacheEntry) => {
          const finalCode =
            !isSSREnv && entry.cssImport ? `${entry.js}\n${entry.cssImport}` : entry.js
          return { code: finalCode, map: entry.map }
        }

        const cached = getCached(cacheKey)
        if (cached) return formatResult(cached)

        const pending = getPendingExtraction(cacheKey)
        if (pending) {
          const result = await pending
          return result ? formatResult(result) : undefined
        }

        // extract
        const extractionPromise = (async (): Promise<CacheEntry | null> => {
          let extracted: ExtractedResponse | null
          try {
            extracted = await Static.extractToClassNames({
              source: code,
              sourcePath: validId,
              options,
              shouldPrintDebug,
            })
          } catch (err) {
            console.error(err instanceof Error ? err.message : String(err))
            return null
          }

          if (!extracted) return null

          const rootRelativeId = `${validId}${virtualExt}`
          const absoluteId = getAbsoluteId(rootRelativeId)
          let cssImport: string | null = null

          if (extracted.styles) {
            this.addWatchFile(rootRelativeId)
            if (server && cssMap.has(absoluteId)) {
              invalidateModule(rootRelativeId)
            }
            cssImport = `import "${rootRelativeId}";`
            cssMap.set(absoluteId, extracted.styles)
          }

          const entry: CacheEntry = {
            js: extracted.js.toString(),
            map: extracted.map,
            cssImport,
          }
          setCache(cacheKey, entry)

          return entry
        })()

        setPendingExtraction(cacheKey, extractionPromise)

        try {
          const result = await extractionPromise
          return result ? formatResult(result) : undefined
        } finally {
          clearPendingExtraction(cacheKey)
        }
      },
    },
  }

  return [basePlugin, rnwLitePlugin, extractPlugin]
}
