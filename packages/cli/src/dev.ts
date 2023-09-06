import { readFile, writeFile } from 'fs/promises'
import { dirname, join, relative } from 'path'

import { CLIResolvedOptions } from '@tamagui/types'
import viteReactPlugin, {
  swcTransform,
  transformForBuild,
} from '@tamagui/vite-native-swc'
import { getVitePath, nativePlugin, tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import chalk from 'chalk'
import { parse } from 'es-module-lexer'
import { pathExists } from 'fs-extra'
import { InlineConfig, build, createServer, resolveConfig } from 'vite'

import { clientInjectionsPlugin } from './dev/clientInjectPlugin'
import { createDevServer } from './dev/createDevServer'
import { HMRListener } from './dev/types'
import { registerDispose } from './utils'

export const dev = async (options: CLIResolvedOptions) => {
  const { root } = options

  process.on('uncaughtException', (err) => {
    // rome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log(err?.message || err)
  })

  const packageRootDir = join(__dirname, '..')

  // react native port (it scans 19000 +5)
  const port = options.port || 8081

  const tamaguiVitePlugin = tamaguiPlugin({
    ...options.tamaguiOptions,
    // useReactNativeWebLite: true,
    target: 'web',
  })

  const plugins = [
    //
    tamaguiVitePlugin,
  ] satisfies InlineConfig['plugins']

  if (process.env.IS_TAMAGUI_DEV) {
    const inspect = require('vite-plugin-inspect')
    // @ts-ignore
    plugins.push(inspect())
  }

  const hmrListeners: HMRListener[] = []
  const hotUpdatedCJSFiles = new Map<string, string>()

  let serverConfig = {
    root,
    mode: 'development',
    clearScreen: false,

    // for expo-router
    // optimizeDeps: {
    //   disabled: false,
    //   include: [
    //     'escape-string-regexp',
    //     'use-latest-callback',
    //     'react-is',
    //     'color',
    //     'warn-once',
    //     '@bacons/react-views',
    //     'invariant',
    //     'compare-versions',
    //     'expo-constants',
    //     'url-parse',
    //     'qs',
    //     '@expo/metro-runtime',
    //   ],
    // },

    plugins: [
      ...plugins,

      react(),

      {
        name: 'tamagui-client-transform',

        async handleHotUpdate({ read, modules, file }) {
          try {
            if (!file.includes('/src/')) {
              return
            }

            const [module] = modules
            if (!module) return

            const id = module?.url || file.replace(root, '')

            const code = await read()

            // got a weird pre compiled file on startup
            if (code.startsWith(`'use strict';`)) return

            if (!code) {
              return
            }

            let source = code

            // we have to remove jsx before we can parse imports...
            source = (await transformForBuild(id, source))?.code || ''

            console.log('FROM-----', code)
            console.log('TO------', source)

            const importsMap = {}

            // parse imports of modules into ids:
            // eg `import x from '@tamagui/core'` => `import x from '/me/node_modules/@tamagui/core/index.js'`
            const [imports] = parse(source)

            let accumulatedSliceOffset = 0

            for (const specifier of imports) {
              const { n: importName, s: start } = specifier

              if (importName) {
                const id = await getVitePath(file, importName)
                console.log('replace', importName, id)
                if (!id) {
                  console.warn('???')
                  continue
                }

                importsMap[id] = id.replace(/^(\.\.\/)+/, '')

                // replace module name with id for hmr
                const len = importName.length
                const extraLen = id.length - len
                source =
                  source.slice(0, start + accumulatedSliceOffset) +
                  id +
                  source.slice(start + accumulatedSliceOffset + len)
                accumulatedSliceOffset += extraLen
              }
            }

            // then we have to convert to commonjs..
            source =
              (
                await swcTransform(id, source, {
                  mode: 'serve-cjs',
                })
              )?.code || ''

            if (!source) {
              throw '❌ no source'
            }

            const hotUpdateSource = `exports = ((exports) => {
              const require = createRequire(${JSON.stringify(importsMap, null, 2)})
              ${source.replace(`import.meta.hot.accept(() => {})`, ``)};
              return exports })({})`

            console.log('hotUpdateSource', hotUpdateSource)

            hotUpdatedCJSFiles.set(id, hotUpdateSource)
          } catch (err) {
            // rome-ignore lint/suspicious/noConsoleLog: <explanation>
            console.log(`Error processing hmr update:`, err)
          }
        },
      },
    ],
    server: {
      cors: true,
      port: options.port,
      host: options.host || '127.0.0.1',
    },
  } satisfies InlineConfig

  // first resolve config so we can pass into client plugin, then add client plugin:
  const resolvedConfig = await resolveConfig(serverConfig, 'serve')

  const viteRNClientPlugin = clientInjectionsPlugin(resolvedConfig)

  serverConfig = {
    ...serverConfig,
    plugins: [...serverConfig.plugins],
  }

  const server = await createServer(serverConfig)

  server.watcher.addListener('change', async (path) => {
    const id = path.replace(process.cwd(), '')
    if (!id.endsWith('tsx') && !id.endsWith('jsx')) {
      return
    }
    // just so it thinks its loaded
    try {
      void server.transformRequest(id)
    } catch (err) {
      // ok
      // rome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log('err', err)
    }
  })

  await server.listen()

  let isBuilding: Promise<string> | null = null

  const dispose = await createDevServer(options, {
    hotUpdatedCJSFiles,
    listenForHMR(cb) {
      hmrListeners.push(cb)
    },
    getIndexBundle: getBundleCode,
    indexJson: getIndexJsonReponse({ port, root }),
  })

  // rome-ignore lint/suspicious/noConsoleLog: ok
  console.log(`Listening on:`, chalk.green(`http://localhost:${port}`))
  server.printUrls()

  registerDispose(() => {
    dispose()
    server.close()
  })

  getBundleCode()

  await new Promise((res) => server.httpServer?.on('close', res))

  async function getBundleCode() {
    // for easier quick testing things:
    const tmpBundle = join(process.cwd(), 'bundle.tmp.js')
    if (await pathExists(tmpBundle)) {
      // rome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log(
        '⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️ returning temp bundle ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️',
        tmpBundle
      )
      return await readFile(tmpBundle, 'utf-8')
    }

    if (isBuilding) {
      const res = await isBuilding
      return res
    }

    let done
    isBuilding = new Promise((res) => {
      done = res
    })

    const jsxRuntime = {
      alias: 'virtual:react-jsx',
      contents: await readFile(
        require.resolve('@tamagui/react-native-prebuilt/jsx-runtime'),
        'utf-8'
      ),
    } as const

    const virtualModules = {
      'react-native': {
        alias: 'virtual:react-native',
        contents: await readFile(
          require.resolve('@tamagui/react-native-prebuilt'),
          'utf-8'
        ),
      },
      react: {
        alias: 'virtual:react',
        contents: await readFile(
          require.resolve('@tamagui/react-native-prebuilt/react'),
          'utf-8'
        ),
      },
      'react/jsx-runtime': jsxRuntime,
      'react/jsx-dev-runtime': jsxRuntime,
    } as const

    const swapRnPlugin = {
      name: `swap-react-native`,
      enforce: 'pre',

      resolveId(id) {
        console.log('id, id', id)

        if (id.startsWith('react-native/Libraries')) {
          return 'virtual:rn-internals'
        }

        for (const targetId in virtualModules) {
          if (id === targetId || id.includes(`node_modules/${targetId}/`)) {
            const info = virtualModules[targetId]
            return info.alias
          }
        }
      },

      load(id) {
        if (id === 'virtual:rn-internals') {
          // TODO make this work by modifying our pre built rn and then adapting react-native-template require function to map to the right place:
          return `export default {}
          export const PressabilityDebugView = () => null`
        }

        for (const targetId in virtualModules) {
          const info = virtualModules[targetId as keyof typeof virtualModules]
          if (id === info.alias) {
            return info.contents
          }
        }
      },
    } as const

    // build app
    const buildConfig = {
      plugins: [
        swapRnPlugin,

        {
          name: 'tamagui-env-native',
          config() {
            return {
              define: {
                'process.env.TAMAGUI_TARGET': JSON.stringify('native'),
              },
            }
          },
        },

        viteRNClientPlugin,

        nativePlugin({
          port,
          mode: 'build',
        }),

        viteReactPlugin({
          tsDecorators: true,
          mode: 'build',
        }),
      ],
      appType: 'custom',
      root,
      clearScreen: false,
      build: {
        ssr: false,
        minify: false,
        rollupOptions: {
          treeshake: false,
          preserveEntrySignatures: 'strict',
          output: {
            format: 'cjs',
          },
        },
      },
      mode: 'development',
      define: {
        __DEV__: 'true',
        'process.env.NODE_ENV': `"development"`,
      },
    } satisfies InlineConfig

    // this fixes my swap-react-native plugin not being called pre 😳
    const resolved = await resolveConfig(buildConfig, 'build')

    console.log('resolved', resolved)

    const buildOutput = await build(buildConfig)

    if (!('output' in buildOutput)) {
      throw `❌`
    }

    let appCode = buildOutput.output
      // entry last
      .sort((a, b) => (a['isEntry'] ? 1 : -1))
      .map((module) => {
        if (module.type == 'chunk') {
          const importsMap = {}
          for (const imp of module.imports) {
            const relativePath = relative(dirname(module.fileName), imp)
            importsMap[relativePath[0] === '.' ? relativePath : './' + relativePath] = imp
          }

          return `
___modules___["${module.fileName}"] = ((exports, module2) => {
  const require = createRequire(${JSON.stringify(importsMap, null, 2)})

  ${module.code
    .replace(`'use strict';`, '')
    .replace('module.exports = ', 'module2.exports = ')}
})

${
  module.isEntry
    ? `
// run entry
const __require = createRequire({})
__require("react-native")
__require("${module.fileName}")
`
    : ''
}
`
        }
      })
      .join('\n')

    if (!appCode) {
      throw `❌`
    }

    appCode = appCode
      // this can be done in the individual file transform
      .replace('undefined.accept(() => {})', '')
      .replace('undefined.accept(function() {});', '') // swc
      .replace(
        `var require_react_refresh_runtime_development =`,
        `var require_react_refresh_runtime_development = globalThis['__RequireReactRefreshRuntime__'] = `
      )
      .replace(
        `var require_Pressability = `,
        `var require_Pressability = globalThis['__ReactPressability__'] =`
      )
      .replace(
        `var require_Pressability = `,
        `var require_Pressability = globalThis['__ReactPressability__'] =`
      )
      .replace(
        `var require_usePressability = `,
        `var require_usePressability = globalThis['__ReactUsePressability__'] =`
      )

    const templateFile = join(packageRootDir, 'react-native-template.js')

    const out = (await readFile(templateFile, 'utf-8')) + appCode

    await writeFile(join(process.cwd(), '.tamagui', 'bundle.js'), out, 'utf-8')

    done(out)
    isBuilding = null

    return out
  }
}

function getIndexJsonReponse({ port, root }: { port: number | string; root }) {
  return {
    name: 'myapp',
    slug: 'myapp',
    scheme: 'myapp',
    version: '1.0.0',
    jsEngine: 'jsc',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
      imageUrl: 'http://127.0.0.1:8081/assets/./assets/splash.png',
    },
    updates: { fallbackToCacheTimeout: 0 },
    assetBundlePatterns: ['**/*'],
    ios: { supportsTablet: true, bundleIdentifier: 'com.natew.myapp' },
    android: {
      package: 'com.tamagui.myapp',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
        foregroundImageUrl: 'http://127.0.0.1:8081/assets/./assets/adaptive-icon.png',
      },
    },
    web: { favicon: './assets/favicon.png' },
    extra: { eas: { projectId: '061b4470-78c7-4d6a-b850-8167fb0a3434' } },
    _internal: {
      isDebug: false,
      projectRoot: root,
      dynamicConfigPath: null,
      staticConfigPath: join(root, 'app.json'),
      packageJsonPath: join(root, 'package.json'),
    },
    sdkVersion: '47.0.0',
    platforms: ['ios', 'android', 'web'],
    iconUrl: `http://127.0.0.1:${port}/assets/./assets/icon.png`,
    debuggerHost: `127.0.0.1:${port}`,
    logUrl: `http://127.0.0.1:${port}/logs`,
    developer: { tool: 'expo-cli', projectRoot: root },
    packagerOpts: { dev: true },
    mainModuleName: 'index',
    __flipperHack: 'React Native packager is running',
    hostUri: `127.0.0.1:${port}`,
    bundleUrl: `http://127.0.0.1:${port}/index.bundle?platform=ios&dev=true&hot=false&lazy=true`,
    id: '@anonymous/myapp-473c4543-3c36-4786-9db1-c66a62ac9b78',
  }
}
