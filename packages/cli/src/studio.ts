import { createRequire } from 'module'
import { AddressInfo } from 'net'
import { dirname } from 'path'

import { tamaguiPlugin } from '@tamagui/vite-plugin'
import chalk from 'chalk'
import express from 'express'
import proxy from 'express-http-proxy'
import fs from 'fs-extra'
import { createServer } from 'vite'

import { watchTamaguiConfig } from './tamaguiConfigUtils.js'
import { ResolvedOptions } from './types.js'

const resolve =
  'url' in import.meta ? createRequire(import.meta.url).resolve : require.resolve

export const studio = async (options: ResolvedOptions) => {
  process.env.TAMAGUI_TARGET = 'web'

  process.stdout.on('error', function (err) {
    if (err.code == 'EPIPE') {
      process.exit(0)
    }
  })

  const { default: getPort } = await import('get-port')
  const { paths } = options
  const root = dirname(resolve('@takeout/studio/entry'))

  const [serverPort, vitePort] = await Promise.all([
    getPort({
      port: 1421,
    }),
    getPort({
      port: 1422,
    }),
  ])

  const server = await createServer({
    root,
    server: {
      // open: true,
      host: options.host,
      port: vitePort,
    },
    plugins: [
      tamaguiPlugin({
        components: ['tamagui'],
      }),
    ],
  })

  // these can be lazy loaded (eventually should put in own process)
  await server.listen()

  const configWatchPromise = watchTamaguiConfig(options)

  const info = server.httpServer?.address() as AddressInfo

  const app = express()

  app.disable('x-powered-by')
  app.use(express.static(paths.dotDir, { maxAge: '2h' }))
  // app.use(morgan('tiny'))

  app.get('/conf.json', async (req, res) => {
    const conf = await fs.readJSON(paths.conf)
    res.status(200).json(conf)
  })

  app.use('/', proxy(`${info.address}:${vitePort}`))

  const appServer = app.listen(serverPort)

  console.log(`Listening on`, chalk.green(`http://localhost:${serverPort}`))

  await Promise.allSettled([
    configWatchPromise,
    new Promise((res) => appServer.on('close', res)),
  ])
}
