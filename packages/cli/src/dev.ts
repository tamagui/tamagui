import { readFile } from 'fs/promises'
import { join } from 'path'

import { CLIResolvedOptions } from '@tamagui/types'
import viteReactPlugin, { swcTransform } from '@tamagui/vite-native-swc'
import {
  nativeBabelTransform,
  nativePlugin,
  nativePrebuild,
  tamaguiPlugin,
} from '@tamagui/vite-plugin'
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
    tamaguiPlugin({
      ...options.tamaguiOptions,
      target: 'native',
    }),
    viteReactPlugin({
      tsDecorators: true,
    }),
  ]

  if (process.env.IS_TAMAGUI_DEV) {
    const inspect = require('vite-plugin-inspect')
    console.log('🐞 enabling inspect plugin')
    plugins.push(inspect())
  }

  const hmrListeners: HMRListener[] = []
  const hotUpdatedCJSFiles = new Map<string, string>()

  let serverConfig = {
    root,
    mode: 'development',
    clearScreen: false,
    appType: 'custom',
    plugins: [
      ...plugins,
      nativePlugin({
        port,
        mode: 'serve',
      }),
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

  // @ts-ignore
  resolvedConfig.plugins = resolvedConfig.plugins.filter((x) => {
    if (x.name === 'vite:import-analysis') {
      return false
    }
    return true
  })

  server.watcher.addListener('change', async (path) => {
    const id = path.replace(process.cwd(), '')

    if (!id.endsWith('tsx') && !id.endsWith('jsx')) {
      return
    }

    const out = await server.transformRequest(id)
    if (!out) return

    let contents = await nativeBabelTransform(out.code)

    contents = contents
      .replace('import.meta.hot.accept(() => {})', '')
      .replace('react_jsx-dev-runtime', 'react/jsx-dev-runtime')
      .replace(/\.js\?v=[0-9a-z]+"/gi, '"')
      .replaceAll('/node_modules/.vite/deps/', '')
      .replace(`import.meta.hot = (0, _client.createHotContext)("/src/App.tsx");`, '')
      .replace('var _client = require("/@vite/client");', '')

    contents = `exports = ((exports) => { ${contents}; return exports })({})`

    hotUpdatedCJSFiles.set(id, contents)
  })

  await server.listen()

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

  // build once on startup
  void getBundleCode()

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
    console.log('building')
    const buildOutput = await build({
      plugins: [
        ...plugins,
        nativePlugin({
          port,
          mode: 'build',
        }),
      ],
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

    const appCode = 'output' in buildOutput ? buildOutput.output[0].code : null

    console.log('appCodeIn', appCode)

    if (!appCode) {
      throw `❌`
    }

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
        `require_ReactNative();
globalThis["ReactPressability"] = require_Pressability;
globalThis["ReactUsePressability"] = require_usePressability;
return require_react_native()`
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
      .replace(
        `// -- app --`,
        appCode.replace('"use strict";', '').replace('undefined.accept(() => {})', '')
      )
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
