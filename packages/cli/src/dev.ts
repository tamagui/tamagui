import { readFile } from 'fs/promises'
import { join } from 'path'

import { CLIResolvedOptions } from '@tamagui/types'
import viteReactPlugin, { swcTransform } from '@tamagui/vite-native-swc'
import { nativeBabelTransform, nativePlugin, nativePrebuild } from '@tamagui/vite-plugin'
import chalk from 'chalk'
import fs, { pathExists } from 'fs-extra'
import { InlineConfig, build, createServer, resolveConfig } from 'vite'

import { clientInjectionsPlugin } from './dev/clientInjectPlugin'
import { createDevServer } from './dev/createDevServer'
import { HMRListener } from './dev/types'
import { registerDispose } from './utils'

export const dev = async (options: CLIResolvedOptions) => {
  const { root, mode, paths } = options
  const projectRoot = root

  const packageRootDir = join(__dirname, '..')

  // build react-native
  await nativePrebuild()

  // react native port (it scans 19000 +5)
  const port = options.port || 8081

  const plugins = [
    // tamaguiPlugin({
    //   components: ['tamagui'],
    //   target: 'native',
    // }),
    viteReactPlugin({
      tsDecorators: true,
    }),
    nativePlugin({
      port,
    }),
  ]

  const hmrListeners: HMRListener[] = []
  const hotUpdatedCJSFiles = new Map<string, string>()

  let serverConfig = {
    root,
    mode: 'development',
    clearScreen: false,
    plugins: [
      ...plugins,

      {
        name: `tamagui-hot-update`,
        async handleHotUpdate({ file, read, modules }) {
          // idk why but its giving me dist asset stuff
          if (!file.includes('/src/')) {
            return
          }

          const id = modules[0]?.url || file.replace(root, '')

          if (!id) {
            console.log('⚠️ no modules?', file)
            return
          }

          try {
            const raw = await read()

            // swc isnt applied here weird
            const swcout = await swcTransform(
              file,
              raw,
              {
                tsDecorators: true,
              },
              true
            )

            if (!swcout) {
              throw 'sadsad'
            }

            let contents = await nativeBabelTransform(swcout.code)

            contents = `exports = ((exports) => { ${contents}; return exports })({})`

            // set here to be fetched next
            // i'd have just sent it in the websocket but maybe theres some size limits
            hotUpdatedCJSFiles.set(id, contents)

            // for (const listener of hmrListeners) {
            //   listener({
            //     file,
            //     contents,
            //   })
            // }
          } catch (err) {
            console.log('error hmring', err)
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
  const viteRNClient = clientInjectionsPlugin(resolvedConfig)

  plugins.push(viteRNClient)

  serverConfig = {
    ...serverConfig,
    plugins: [...serverConfig.plugins],
  }

  const server = await createServer(serverConfig)

  await server.listen()

  // need to simulate browser fetching a file so vite loads module into module graph and hmr works
  // no luck yet:

  // trying to see whats going on with this:
  // server.moduleGraph = new Proxy(server.moduleGraph, {
  //   get(t, p) {
  //     console.log('get', p)
  //     const out = Reflect.get(t, p)
  //     if (typeof out === 'function') {
  //       return new Proxy(out, {
  //         apply(a, b, c) {
  //           console.log('apply', p, c)
  //           return Reflect.apply(a as any, b, c)
  //         },
  //       })
  //     }
  //     return out
  //   },
  // })

  // server.moduleGraph.resolveUrl('/src/App.tsx')
  // server.moduleGraph.getModuleByUrl('/src/App.tsx')
  // server.moduleGraph.ensureEntryFromUrl('/src/App.tsx', false)
  // await ensureDir(options.paths.dotDir)
  // const res = await watchTamaguiConfig(options.tamaguiOptions)

  const dispose = await createDevServer(options, {
    hotUpdatedCJSFiles,
    listenForHMR(cb) {
      hmrListeners.push(cb)
    },
    getIndexBundle: async function getBundle() {
      const outputCode = await getBundleCode()

      return outputCode
    },
    indexJson: getIndexJsonReponse({ port, root }),
  })

  // rome-ignore lint/nursery/noConsoleLog: ok
  console.log(`Listening on:`, chalk.green(`http://localhost:${port}`))
  server.printUrls()

  registerDispose(() => {
    dispose()
    server.close()
  })

  await new Promise((res) => server.httpServer?.on('close', res))

  async function getBundleCode() {
    // for easier quick testing things:
    const tmpBundle = join(process.cwd(), 'bundle.tmp.js')
    if (await pathExists(tmpBundle)) {
      // rome-ignore lint/nursery/noConsoleLog: <explanation>
      console.log(
        '⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️ returning temp bundle ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️',
        tmpBundle
      )
      return await readFile(tmpBundle, 'utf-8')
    }

    // build app
    const buildOutput = await build({
      // @ts-ignore
      plugins,
      appType: 'custom',
      root,
      clearScreen: false,
      build: {
        ssr: false,
      },
      mode: 'development',
      define: {
        __DEV__: 'true',
        'process.env.NODE_ENV': `"development"`,
      },
    })

    const appCodeIn = 'output' in buildOutput ? buildOutput.output[0].code : null

    if (!appCodeIn) {
      throw `❌`
    }

    const appCode = await nativeBabelTransform(appCodeIn)

    const paths = [
      join(process.cwd(), 'testing-area', 'react.js'),
      join(process.cwd(), 'testing-area', 'react-jsx-runtime.js'),
      join(process.cwd(), 'testing-area', 'react-native.js'),
    ]

    const [react, reactJsxRuntime, reactNative] = await Promise.all(
      paths.map((p) => readFile(p, 'utf-8'))
    )

    const reactCode = react.replace(
      `module.exports = require_react_development();`,
      `return require_react_development()`
    )

    const reactJSXRuntimeCode = reactJsxRuntime.replace(
      `module.exports = require_react_jsx_runtime_production_min();`,
      `return require_react_jsx_runtime_production_min()`
      // `module.exports = require_react_jsx_dev_runtime_development();`,
      // `return require_react_jsx_dev_runtime_development();`
    )

    const reactNativeCode = reactNative
      .replace(
        `module.exports = require_react_native();`,
        `require_ReactNative(); return require_react_native()`
      )
      // forcing onto global so i can re-thread it into require
      .replace(
        `ReactRefreshRuntime.injectIntoGlobalHook(global);`,
        `globalThis['_ReactRefreshRuntime'] = ReactRefreshRuntime; ReactRefreshRuntime.injectIntoGlobalHook(global);`
      )

    const templateFile = join(packageRootDir, 'react-native-template.js')

    return (await readFile(templateFile, 'utf-8'))
      .replace(`// -- react --`, reactCode)
      .replace(`// -- react-native --`, reactNativeCode)
      .replace(`// -- react/jsx-runtime --`, reactJSXRuntimeCode)
      .replace(`// -- app --`, appCode.replace('"use strict";', ''))
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
