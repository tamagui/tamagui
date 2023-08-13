import { readFile } from 'fs/promises'
import { AddressInfo } from 'net'
import { join } from 'path'

import { CLIResolvedOptions } from '@tamagui/types'
import viteReactPlugin from '@tamagui/vite-native-swc'
import {
  nativeBabelTransform,
  nativePlugin,
  nativePrebuild,
  tamaguiPlugin,
} from '@tamagui/vite-plugin'
import chalk from 'chalk'
import fs, { ensureDir, pathExists } from 'fs-extra'
import { build, createServer } from 'vite'

import { clientInjectionsPlugin } from './dev/clientInjectPlugin'
import { createDevServer } from './dev/createDevServer'
import { HMRListener } from './dev/types'
import { registerDispose } from './utils'

export const dev = async (options: CLIResolvedOptions) => {
  const { root, mode, paths } = options

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
      plugins: [],
    }),
    nativePlugin({
      port,
    }),
    clientInjectionsPlugin(),
  ]

  const hmrListeners: HMRListener[] = []

  const server = await createServer({
    root,
    mode: 'development',
    clearScreen: false,
    plugins: [
      ...plugins,
      // custom hmr server handling
      {
        name: `tamagui-hot-update`,
        async handleHotUpdate({ file, read }) {
          // idk why but its giving me dist asset stuff
          if (file.includes('/dist/') || file.includes('.tamagui')) {
            return
          }
          console.log('handle hot update', file)
          try {
            const raw = await read()
            const contents = await nativeBabelTransform(raw)

            // send
            console.log('send', contents, hmrListeners.length)

            for (const listener of hmrListeners) {
              listener({
                file,
                contents,
              })
            }
          } catch (err) {
            console.log('error hmring', err)
          }
        },
      },
    ],
    server: {
      hmr: true,
      cors: true,
      port: options.port,
      host: options.host || 'localhost',
    },
  })

  await server.listen()

  // await ensureDir(options.paths.dotDir)
  // const res = await watchTamaguiConfig(options.tamaguiOptions)

  const defaultResponse = {
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
      projectRoot: '/Users/n8/tamagui/apps/kitchen-sink',
      dynamicConfigPath: null,
      staticConfigPath: '/Users/n8/tamagui/apps/kitchen-sink/app.json',
      packageJsonPath: '/Users/n8/tamagui/apps/kitchen-sink/package.json',
    },
    sdkVersion: '47.0.0',
    platforms: ['ios', 'android', 'web'],
    iconUrl: `http://127.0.0.1:${port}/assets/./assets/icon.png`,
    debuggerHost: `127.0.0.1:${port}`,
    logUrl: `http://127.0.0.1:${port}/logs`,
    developer: { tool: 'expo-cli', projectRoot: '/Users/n8/tamagui/apps/kitchen-sink' },
    packagerOpts: { dev: true },
    mainModuleName: 'index',
    __flipperHack: 'React Native packager is running',
    hostUri: `127.0.0.1:${port}`,
    bundleUrl: `http://127.0.0.1:${port}/index.bundle?platform=ios&dev=true&hot=false&lazy=true`,
    id: '@anonymous/myapp-473c4543-3c36-4786-9db1-c66a62ac9b78',
  }

  // new server
  const outputJsPath = join(process.cwd(), '.tamagui', 'bundle.js')

  const dispose = await createDevServer(options, {
    listenForHMR(cb) {
      hmrListeners.push(cb)
    },
    getIndexBundle: async function getBundle() {
      const outputCode = await getBundleCode()

      // so you can debug output easier
      setTimeout(() => {
        fs.writeFile(outputJsPath, outputCode)
      })

      return outputCode
    },
    indexJson: defaultResponse,
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
      join(require.resolve('@tamagui/vite-native-swc'), '..', 'refresh-runtime.js'),
    ]

    const [react, reactJsxRuntime, reactNative, refreshCode] = await Promise.all(
      paths.map((p) => readFile(p, 'utf-8'))
    )

    const reactCode = react.replace(
      `module.exports = require_react_development();`,
      `return require_react_development()`
    )

    const reactJSXRuntimeCode = reactJsxRuntime.replace(
      `module.exports = require_react_jsx_runtime_production_min();`,
      `return require_react_jsx_runtime_production_min()`
    )

    const reactNativeCode = reactNative
      .replace(
        `module.exports = require_react_native();`,
        `return require_react_native()`
      )
      .replace(
        `renderable = /* @__PURE__ */ react(RootComponentWithMeaningfulName, null, renderable);`,
        ``
      )

    const templateFile = join(packageRootDir, 'react-native-template.js')

    return (await readFile(templateFile, 'utf-8'))
      .replace(`// -- react --`, reactCode)
      .replace(`// -- refresh-runtime --`, refreshCode)
      .replace(`// -- react-native --`, reactNativeCode)
      .replace(`// -- react/jsx-runtime --`, reactJSXRuntimeCode)
      .replace(`// -- app --`, appCode)
  }
}
