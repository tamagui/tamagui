import type { TamaguiOptions, ExtractedResponse } from '@tamagui/static-worker'
import * as Static from '@tamagui/static-worker'
import { getPragmaOptions } from '@tamagui/static-worker'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import { normalizePath, transformWithEsbuild, type Environment } from 'vite'
import { loadTamaguiBuildConfig, getLoadPromise, getTamaguiOptions } from './loadTamagui'

const resolve = (name: string) => fileURLToPath(import.meta.resolve(name))

type AliasOptions = {
  /** use @tamagui/react-native-web-lite, 'without-animated' for smaller bundle */
  rnwLite?: boolean | 'without-animated'
  /** alias react-native-svg to @tamagui/react-native-svg */
  svg?: boolean
}

type AliasEntry = { find: string | RegExp; replacement: string }

/**
 * returns vite-compatible aliases for tamagui
 * use this when you need control over alias ordering in your config
 */
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
    const rnwlSS = resolve(
      '@tamagui/react-native-web-lite/dist/exports/StyleSheet/compiler/createReactDOMStyle'
    )

    aliases.push(
      {
        find: /react-native.*\/dist\/exports\/StyleSheet\/compiler\/createReactDOMStyle/,
        replacement: rnwlSS,
      },
      {
        find: /^react-native$/,
        replacement: rnwl,
      },
      {
        find: /^react-native\/(.+)$/,
        replacement: `${rnwl}/$1`,
      },
      {
        find: 'react-native/package.json',
        replacement: resolve('@tamagui/react-native-web-lite/package.json'),
      },
      {
        find: /^react-native-web$/,
        replacement: rnwl,
      },
      {
        find: /^react-native-web\/(.+)$/,
        replacement: `${rnwl}/$1`,
      }
    )
  }

  return aliases
}

export function tamaguiPlugin({
  optimize,
  disableResolveConfig,
  ...tamaguiOptionsIn
}: TamaguiOptions & { optimize?: boolean; disableResolveConfig?: boolean } = {}):
  | Plugin
  | Plugin[] {
  const shouldExtract = !!optimize
  let watcher: Promise<{ dispose: () => void } | void | undefined> | undefined

  // TODO temporary fix
  const enableNativeEnv = !!globalThis.__vxrnEnableNativeEnv

  const extensions = [
    `.web.mjs`,
    `.web.js`,
    `.web.jsx`,
    `.web.ts`,
    `.web.tsx`,
    '.mjs',
    '.js',
    '.mts',
    '.ts',
    '.jsx',
    '.tsx',
    '.json',
  ]

  // start loading immediately but don't block
  loadTamaguiBuildConfig(tamaguiOptionsIn)

  // helper to await load when needed
  const ensureLoaded = async () => {
    const promise = getLoadPromise()
    if (promise) await promise
    return getTamaguiOptions()
  }

  // extract plugin state (only used when optimize=true)
  const getHash = (input: string) => createHash('sha1').update(input).digest('base64')

  type CacheEntry = {
    js: string
    map: any
    cssImport: string | null
  }

  let memoryCache: Record<string, CacheEntry> = {}
  let cacheSize = 0

  const clearCompilerCache = () => {
    memoryCache = {}
    cacheSize = 0
  }

  const cssMap = new Map<string, string>()
  let config: ResolvedConfig
  let server: ViteDevServer
  const virtualExt = `.tamagui.css`

  const getAbsoluteVirtualFileId = (filePath: string) => {
    if (filePath.startsWith(config.root)) {
      return filePath
    }
    return normalizePath(path.join(config.root, filePath))
  }

  function isNotClient(environment?: Environment) {
    return environment?.name && environment.name !== 'client'
  }

  function isNative(environment?: Environment) {
    return (
      environment?.name && (environment.name === 'ios' || environment.name === 'android')
    )
  }

  function invalidateModule(absoluteId: string) {
    if (!server) return

    const { moduleGraph } = server
    const modules = moduleGraph.getModulesByFile(absoluteId)

    if (modules) {
      for (const module of modules) {
        moduleGraph.invalidateModule(module)
        module.lastHMRTimestamp = module.lastInvalidationTimestamp || Date.now()
      }
    }
  }

  const basePlugin: Plugin = {
    name: 'tamagui',
    enforce: 'pre',

    configureServer(_server) {
      server = _server
    },

    async buildEnd() {
      await watcher?.then((res) => {
        res?.dispose()
      })
    },

    async transform(code, id) {
      if (id.includes('expo-linear-gradient')) {
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        })
      }
    },

    async config(_, env) {
      const options = await ensureLoaded()

      if (!options) {
        throw new Error(`No tamagui options loaded`)
      }

      // start watching config if enabled
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
          // reanimated support
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
                    ...(!options?.useReactNativeWebLite && {
                      'react-native': resolve('react-native-web'),
                    }),
                  }),
                },
              },
      }
    },
  }

  const rnwLitePlugin: Plugin = {
    name: 'tamagui-rnw-lite',

    config() {
      if (enableNativeEnv) {
        return {}
      }

      const options = getTamaguiOptions()
      if (!options?.useReactNativeWebLite) {
        return {}
      }

      const rnwl = resolve(
        options.useReactNativeWebLite === 'without-animated'
          ? '@tamagui/react-native-web-lite/without-animated'
          : '@tamagui/react-native-web-lite'
      )
      const rnwlSS = resolve(
        '@tamagui/react-native-web-lite/dist/exports/StyleSheet/compiler/createReactDOMStyle'
      )

      return {
        resolve: {
          alias: [
            {
              find: /react-native.*\/dist\/exports\/StyleSheet\/compiler\/createReactDOMStyle/,
              replacement: rnwlSS,
            },
            {
              find: /^react-native$/,
              replacement: rnwl,
            },
            {
              find: /^react-native\/(.+)$/,
              replacement: `${rnwl}/$1`,
            },
            {
              find: /^react-native-web$/,
              replacement: rnwl,
            },
            {
              find: /^react-native-web\/(.+)$/,
              replacement: `${rnwl}/$1`,
            },
          ],
        },
      }
    },
  }

  if (!shouldExtract) {
    return [basePlugin, rnwLitePlugin]
  }

  // extract plugin for optimize mode
  const extractPlugin: Plugin = {
    name: 'tamagui-extract',
    enforce: 'pre',

    config(userConf) {
      userConf.optimizeDeps ||= {}
      userConf.optimizeDeps.include ||= []
      userConf.optimizeDeps.include.push('@tamagui/core/inject-styles')
    },

    async configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    async resolveId(source) {
      if (isNative(this.environment)) {
        return
      }

      if (isNotClient(this.environment)) {
        return
      }

      const [validId, query] = source.split('?')

      if (!validId.endsWith(virtualExt)) {
        return
      }

      const absoluteId = source.startsWith(config.root)
        ? source
        : getAbsoluteVirtualFileId(validId)

      if (cssMap.has(absoluteId)) {
        return absoluteId + (query ? `?${query}` : '')
      }
    },

    async load(id) {
      const options = getTamaguiOptions()
      if (options?.disable) {
        return
      }

      if (isNative(this.environment)) {
        return
      }

      if (isNotClient(this.environment)) {
        return
      }

      const [validId] = id.split('?')
      return cssMap.get(validId)
    },

    transform: {
      order: 'pre',
      async handler(code, id) {
        // ensure tamagui is loaded before transform
        const options = await ensureLoaded()

        if (options?.disable) {
          return
        }

        if (isNative(this.environment)) {
          return
        }

        const [validId] = id.split('?')
        if (!validId.endsWith('.tsx')) {
          return
        }

        const firstCommentIndex = code.indexOf('// ')
        const { shouldDisable, shouldPrintDebug } = await getPragmaOptions({
          source: firstCommentIndex >= 0 ? code.slice(firstCommentIndex) : '',
          path: validId,
        })

        if (shouldPrintDebug) {
          console.trace(
            `Current file: ${id} in environment: ${this.environment?.name}, shouldDisable: ${shouldDisable}`
          )
          console.info(`\n\nOriginal source:\n${code}\n\n`)
        }

        if (shouldDisable) {
          return
        }

        const isSSR = isNotClient(this.environment)

        // cache key without environment - share compiled JS between SSR/client
        const cacheKey = getHash(`${code}${id}`)
        const cached = memoryCache[cacheKey]

        if (cached) {
          // for client, append the CSS import if we have one
          if (!isSSR && cached.cssImport) {
            return {
              code: `${cached.js}\n${cached.cssImport}`,
              map: cached.map,
            }
          }
          // for SSR, just return the JS without CSS import
          return {
            code: cached.js,
            map: cached.map,
          }
        }

        let extracted: ExtractedResponse | null
        try {
          extracted = await Static!.extractToClassNames({
            source: code,
            sourcePath: validId,
            options: options!,
            shouldPrintDebug,
          })
        } catch (err) {
          console.error(err instanceof Error ? err.message : String(err))
          return
        }

        if (!extracted) {
          return
        }

        const rootRelativeId = `${validId}${virtualExt}`
        const absoluteId = getAbsoluteVirtualFileId(rootRelativeId)

        let cssImport: string | null = null

        // store CSS and prepare import (but don't include in cached JS)
        if (extracted.styles) {
          this.addWatchFile(rootRelativeId)

          if (server && cssMap.has(absoluteId)) {
            invalidateModule(rootRelativeId)
          }

          cssImport = `import "${rootRelativeId}";`
          cssMap.set(absoluteId, extracted.styles)
        }

        // cache the JS separately from CSS import
        const jsCode = extracted.js.toString()
        const cacheEntry: CacheEntry = {
          js: jsCode,
          map: extracted.map,
          cssImport,
        }

        cacheSize += jsCode.length
        // 64MB cache
        if (cacheSize > 67108864) {
          clearCompilerCache()
        }
        memoryCache[cacheKey] = cacheEntry

        // return with or without CSS import based on environment
        const finalCode = !isSSR && cssImport ? `${jsCode}\n${cssImport}` : jsCode

        return {
          code: finalCode,
          map: extracted.map,
        }
      },
    },
  }

  return [basePlugin, rnwLitePlugin, extractPlugin]
}
