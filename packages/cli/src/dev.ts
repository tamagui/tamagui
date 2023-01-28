import { AddressInfo } from 'net'
import { join } from 'path'

import { nativePlugin, tamaguiPlugin } from '@tamagui/vite-plugin'
import chalk from 'chalk'
import express from 'express'
import proxy from 'express-http-proxy'
import fs from 'fs-extra'
import killPort from 'kill-port'
import morgan from 'morgan'
import { build, createServer } from 'vite'

import { watchTamaguiConfig } from './tamaguiConfigUtils.js'
import { ResolvedOptions } from './types.js'
import { closeEvent } from './utils.js'

export const dev = async (options: ResolvedOptions) => {
  const { root, mode, paths } = options

  process.chdir(process.cwd())

  const plugins = [
    tamaguiPlugin({
      components: ['tamagui'],
    }),
    nativePlugin(),
  ]

  const buildOutput = await build({
    plugins,
    root,
  })
  const outputJsFile = 'output' in buildOutput ? buildOutput.output[0]?.fileName : null
  if (!outputJsFile) {
    throw new Error(`No js?`)
  }
  const outputJsPath = join(process.cwd(), 'dist', outputJsFile)

  const server = await createServer({
    root,
    server: {
      port: options.port,
      host: options.host || 'localhost',
    },
    plugins,
  })

  // these can be lazy loaded (eventually should put in own process)
  await Promise.all([
    server.listen(),
    //
    watchTamaguiConfig(options),
    // generateTypes(options),
  ])

  const info = server.httpServer?.address() as AddressInfo
  const app = express()

  const cleanup = async () => {
    console.log('cleaning up')
    await server.close()
  }

  process.on(`uncaughtException`, (e) => {
    console.log('wtdf', e)
  })
  ;[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, cleanup)
  })

  // react native port (it scans 19000 +5)
  const port = 19000

  app.disable('x-powered-by')
  app.use(express.static(paths.dotDir, { maxAge: '2h' }))
  app.use(morgan('tiny'))

  // studio specific - move out eventually to studioPlugin

  app.get('/status', (req, res) => {
    res.status(200).send()
  })

  app.get('/conf', async (req, res) => {
    const conf = await fs.readJSON(paths.conf)
    res.status(200).json(conf)
  })

  // /index.bundle?platform=ios&dev=true&minify=false&modulesOnly=false&runModule=true&app=dish.motion:2811:36)
  app.get('/index.bundle', async (req, res) => {
    const output = (await fs.readFile(outputJsPath)).toString()

    res.status(200)
    res.header('Content-Type', 'text/javascript')
    res.send(output)
  })

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

  app.get('/', (req, res) => {
    res.status(200).json(defaultResponse)
  })

  // app.use('/', proxy(`${info.address}:${info.port}`))

  await killPort(port)
  app.listen(port)

  // eslint-disable-next-line no-console
  console.log(`Listening on`, chalk.green(`http://localhost:${port}`))
  server.printUrls()

  await closeEvent(server)
}
