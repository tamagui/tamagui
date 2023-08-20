import { readFile, writeFile } from 'fs/promises'
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
import { pathExists } from 'fs-extra'
import { InlineConfig, build, createServer, resolveConfig } from 'vite'

import { clientInjectionsPlugin } from './dev/clientInjectPlugin'
import { createDevServer } from './dev/createDevServer'
import { HMRListener } from './dev/types'
import { registerDispose } from './utils'

export const dev = async (options: CLIResolvedOptions) => {
  const { root } = options

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
    esbuild: false,
    clearScreen: false,
    appType: 'custom',
    plugins: [
      ...plugins,
      viteReactPlugin({
        tsDecorators: true,
        mode: 'serve',
      }),
      nativePlugin({
        port,
        mode: 'serve',
      }),

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

            const swcout = await swcTransform(file, raw, {
              mode: 'serve',
            })

            if (!swcout) {
              throw '❌'
            }

            let contents = await nativeBabelTransform(swcout.code)
            contents = contents.replace(`import.meta.hot.accept(() => {});`, ``)
            contents = `exports = ((exports) => { ${contents}; return exports })({})`

            hotUpdatedCJSFiles.set(id, contents)
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

  server.watcher.addListener('change', async (path) => {
    const id = path.replace(process.cwd(), '')

    if (!id.endsWith('tsx') && !id.endsWith('jsx')) {
      return
    }

    // just so it thinks its loaded
    void server.transformRequest(id)
  })

  await server.listen()

  const dispose = await createDevServer(options, {
    hotUpdatedCJSFiles,
    listenForHMR(cb) {
      hmrListeners.push(cb)
    },
    getIndexBundle: getBundleCode,
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
      plugins: [
        ...plugins,
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
      },
      mode: 'development',
      define: {
        __DEV__: 'true',
        'process.env.NODE_ENV': `"development"`,
      },
    })

    let appCode = 'output' in buildOutput ? buildOutput.output[0].code : null

    if (!appCode) {
      throw `❌`
    }

    appCode = appCode
      // this can be done in the individual file transform
      .replace('undefined.accept(() => {})', '')
      .replace(
        `if (hasRequiredReact) return react.exports;`,
        `if (react.exports && react.exports.createElement) return react.exports;`
      )
      .replace(
        `var require_react_refresh_runtime_development =`,
        `var require_react_refresh_runtime_development = globalThis['__RequireReactRefreshRuntime__'] = `
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
