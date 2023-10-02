import { join } from 'path'

import { tamaguiPlugin } from '@tamagui/vite-plugin'
import { create } from '@tamagui/vite-react-native'
import chalk from 'chalk'
import { context } from 'esbuild'
import express, { Express } from 'express'
import { pathExists } from 'fs-extra'
import { ViteDevServer } from 'vite'
import inspectPlugin from 'vite-plugin-inspect'

type Options = {
  root?: string
  host?: string
}

type OptionsFilled = Required<Options>

const defaultOptions = {
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

  const { viteServer, start, stop } = await create({
    root: options.root,
    host: options.host,
    webConfig: {
      plugins: [tamaguiVitePlugin, inspectPlugin()],
    },
    buildConfig: {
      plugins: [],
    },
  })

  const { closePromise } = await start()

  // biome-ignore lint/suspicious/noConsoleLog: ok
  console.log(`Listening on:`, chalk.green(`http://localhost:8081`))
  viteServer.printUrls()

  const vertqlExpressServer = startVertqlServer(options, viteServer)
  const userAppServer = startUserAppServer(options, vertqlExpressServer)

  const vertqlGraphBuilder = await startVertqlGraphBuilder(options)
  vertqlGraphBuilder.watch()

  const expressServer = vertqlExpressServer.listen(8091)

  // wait for all servers
  await Promise.all([
    closePromise,
    userAppServer,
    vertqlExpressServer,
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

function startVertqlServer(options: OptionsFilled, viteServer: ViteDevServer) {
  const viteAddress = viteServer.httpServer?.address
  const app = express()
  const target = `http://${viteAddress}:8081`
  // app.use(
  //   '/',
  //   createProxyMiddleware({
  //     target,
  //     ws: true,
  //   })
  // )

  return app
}

async function startUserAppServer(options: OptionsFilled, app: Express) {
  const serverPath = join(options.root, 'server.ts')
  if (await pathExists(serverPath)) {
    const { register } = require('esbuild-register/dist/node')
    const { unregister } = register()
    try {
      const serverEndpoint = require(serverPath).default
      // biome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log('starting user server', serverPath)
      serverEndpoint(app)
    } finally {
      unregister()
    }
  }
}
