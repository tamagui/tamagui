import { join } from 'path'

import { tamaguiPlugin } from '@tamagui/vite-plugin'
import chalk from 'chalk'
import { context } from 'esbuild'
import type { Express } from 'express';
import express from 'express'
import { pathExists } from 'fs-extra'
import { createProxyMiddleware } from 'http-proxy-middleware'
import inspectPlugin from 'vite-plugin-inspect'
import { create } from 'vxrn'

type Options = {
  root?: string
  port?: number
  host?: string
}

type OptionsFilled = Required<Options>

const defaultOptions = {
  port: 8081,
  root: process.cwd(),
  host: '127.0.0.1',
} satisfies Options

export const dev = async (optionsIn: Options) => {
  const options = {
    ...defaultOptions,
    ...optionsIn,
  }

  const tamaguiVitePlugin = tamaguiPlugin({
    components: ['@tamagui/core'],
    config: 'src/tamagui.config.ts',
  })

  const { default: getPort } = await import('get-port')

  const [internalNativePort, externalNativePort] = await Promise.all([
    getPort(),
    getPort({
      port: options.port,
    }),
  ])

  const { viteServer, start, stop } = await create({
    root: options.root,
    host: options.host,
    nativePort: internalNativePort,
    webConfig: {
      // @ts-ignore
      plugins: [tamaguiVitePlugin, inspectPlugin()],
    },
    buildConfig: {
      plugins: [],
    },
  })

  const { closePromise } = await start()

  const expressApp = express()

  const userAppServer = await startUserAppServer(options, expressApp)

  const webInfo = viteServer.httpServer?.address()

  if (!webInfo || typeof webInfo === 'string') {
    throw new Error(`Invalid webinfo`)
  }

  const target = `http://${options.host}:${webInfo.port}`

  // proxy to web
  expressApp.use(
    '/',
    createProxyMiddleware({
      target,
      ws: true,
    })
  )

  console.info(
    `Native server:\n  `,
    chalk.green(`http://localhost:${externalNativePort}`)
  )
  console.info(`Web server: http://localhost:3333`)
  // viteServer.printUrls()

  const expressServer = expressApp.listen(3333)

  const vertqlGraphBuilder = await startVertqlGraphBuilder(options)
  vertqlGraphBuilder.watch()

  process.on('beforeExit', () => {
    stop()
  })

  process.on('SIGINT', () => {
    stop()
  })

  process.on('uncaughtException', (err) => {
    console.error(err?.message || err)
  })

  // wait for all servers
  await Promise.all([
    closePromise,
    userAppServer,
    new Promise((res) => {
      expressServer.once('close', res)
    }),
  ])
}

async function startVertqlGraphBuilder(options: OptionsFilled) {
  return await context({
    // just pleasing weird grats things for now
    entryPoints: [join(options.root, 'graph', 'user.ts')],
    target: 'node16',
    format: 'cjs',
    outdir: join(options.root, '..', '..', 'dist', 'apps', 'tamastack', 'graph'),
  })
}

async function startUserAppServer(options: OptionsFilled, app: Express) {
  const serverPath = join(options.root, 'server.ts')
  if (await pathExists(serverPath)) {
    const { register } = require('esbuild-register/dist/node')
    const { unregister } = register()
    try {
      const serverEndpoint = require(serverPath).default
      console.info('starting user server', serverPath)
      serverEndpoint(app)
    } finally {
      unregister()
    }
  }
}
