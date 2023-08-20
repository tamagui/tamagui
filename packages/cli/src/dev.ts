import { readFile, writeFile } from 'fs/promises'
import { createRequire } from 'module'
import { join, relative } from 'path'

import { CLIResolvedOptions } from '@tamagui/types'
import viteReactPlugin, { swcTransform } from '@tamagui/vite-native-swc'
import {
  nativeBabelTransform,
  nativePlugin,
  nativePrebuild,
  tamaguiPlugin,
} from '@tamagui/vite-plugin'
import chalk from 'chalk'
import { parse } from 'es-module-lexer'
import { pathExists } from 'fs-extra'
import { InlineConfig, build, createServer, resolveConfig } from 'vite'

import { clientInjectionsPlugin } from './dev/clientInjectPlugin'
import { createDevServer } from './dev/createDevServer'
import { HMRListener } from './dev/types'
import { registerDispose } from './utils'

const resolve =
  'url' in import.meta ? createRequire(import.meta.url).resolve : require.resolve

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
            let source = await read()

            console.log('source1', source)

            // we have to remove jsx before we can parse imports...
            source =
              (
                await swcTransform(file, source, {
                  mode: 'serve',
                })
              )?.code || ''

            console.log('source2', source)

            if (!source) {
              throw '❌'
            }

            // parse imports of modules into ids:
            // eg `import x from '@tamagui/core'` => `import x from '/me/node_modules/@tamagui/core/index.js'`
            const [imports] = parse(source)

            let accumulatedSliceOffset = 0

            for (const specifier of imports) {
              const { n: importName, s: start, se: end } = specifier

              // except the ones we already handle using global require
              if (
                importName === 'react-native' ||
                importName === 'react' ||
                importName === 'react/jsx-runtime' ||
                importName === 'react/jsx-dev-runtime'
              ) {
                continue
              }

              if (importName && importName[0] !== '.') {
                const id = relative(process.cwd(), resolve(importName))
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
            source = await nativeBabelTransform(source)
            source = source.replace(`import.meta.hot.accept(() => {});`, ``)
            source = `exports = ((exports) => { ${source}; return exports })({})`

            hotUpdatedCJSFiles.set(id, source)
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

  let isBuilding: Promise<string> | null = null

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
    if (isBuilding) {
      return await isBuilding
    }

    let done
    isBuilding = new Promise((res) => {
      done = res
    })

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
        minify: false,
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
      .replace('undefined.accept(function() {});', '') // swc
      .replace(
        `var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};`,
        `var __commonJSOg = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
__commonJS = (cb, mod) => {
  // expose it to require()
  const id = __getOwnPropNames(cb)[0]
  const output = __commonJSOg(cb, mod)
  ___modules___[id] = output
  return output
}`
      )
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

    void writeFile(join(process.cwd(), '.tamagui', 'bundle.js'), out, 'utf-8')

    done(out)

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
