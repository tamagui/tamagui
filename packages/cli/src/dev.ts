import { readFile } from 'fs/promises'
import { AddressInfo } from 'net'
import { join } from 'path'

import chalk from 'chalk'
import fs from 'fs-extra'
import { build, createServer } from 'vite'

import { createDevServer } from './dev/createDevServer.js'
import { watchTamaguiConfig } from './tamaguiConfigUtils.js'
import { ResolvedOptions } from './types.js'
import { registerDispose } from './utils.js'

export const dev = async (options: ResolvedOptions) => {
  const { root, mode, paths } = options

  process.chdir(process.cwd())

  const { tamaguiPlugin, nativePlugin, nativePrebuild } = await import(
    '@tamagui/vite-plugin'
  )

  // build react-native
  await nativePrebuild()

  const plugins = [
    tamaguiPlugin({
      components: ['tamagui'],
    }),
    nativePlugin(),
  ]

  async function getBundle() {
    const outputJsPath = join(process.cwd(), '.tamagui', 'bundle.js')
    const outputCode = await getBundleCode()
    // debug out each time
    fs.writeFile(outputJsPath, outputCode)
    return outputCode
  }

  async function getBundleCode() {
    // build app
    const buildOutput = await build({
      plugins,
      appType: 'custom',
      root: join(root, 'src/index.ts'),
      build: {
        ssr: true,
      },
      ssr: {
        format: 'cjs',
        target: 'node',
      },
      mode: 'development',
      define: {
        __DEV__: 'true',
        'process.env.NODE_ENV': `"development"`,
      },
    })

    const appCode = 'output' in buildOutput ? buildOutput.output[0].code : null

    if (!appCode) {
      throw `❌`
    }

    const [react, reactJsxRuntime, reactNative] = await Promise.all([
      readFile(join(process.cwd(), 'react.js'), 'utf-8'),
      readFile(join(process.cwd(), 'react-jsx-runtime.js'), 'utf-8'),
      readFile(join(process.cwd(), 'react-native.js'), 'utf-8'),
    ])

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

    return (await readFile('template.js', 'utf-8'))
      .replace(`// -- react --`, reactCode)
      .replace(`// -- react-native --`, reactNativeCode)
      .replace(`// -- react/jsx-runtime --`, reactJSXRuntimeCode)
      .replace(`// -- app --`, appCode)
  }

  const server = await createServer({
    root: root,
    mode: 'development',
    plugins,
    server: {
      port: options.port,
      host: options.host || 'localhost',
    },
  })

  await server.listen()
  await watchTamaguiConfig(options)

  const info = server.httpServer?.address() as AddressInfo

  // react native port (it scans 19000 +5)
  const port = 8081

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
    bundleUrl: `http://127.0.0.1:${port}/index.bundle?platform=ios&dev=true&hot=false`,
    id: '@anonymous/myapp-473c4543-3c36-4786-9db1-c66a62ac9b78',
  }

  // new server
  const dispose = await createDevServer(options, {
    getIndexBundle: getBundle,
    indexJson: defaultResponse,
  })

  // eslint-disable-next-line no-console
  console.log(`Listening on:`, chalk.green(`http://localhost:${port}`))
  server.printUrls()

  registerDispose(() => {
    dispose()
    server.close()
  })

  await new Promise((res) => server.httpServer?.on('close', res))

  console.log('closed')
}
