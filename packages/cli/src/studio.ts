import { createRequire } from 'module'
import { AddressInfo } from 'net'
import { dirname } from 'path'

import { tamaguiPlugin } from '@tamagui/vite-plugin'
import viteReactPlugin from '@vitejs/plugin-react-swc'
import chalk from 'chalk'
import express from 'express'
import proxy from 'express-http-proxy'
import fs from 'fs-extra'
import { createServer } from 'vite'

import { watchTamaguiConfig } from './tamaguiConfigUtils.js'
import { ResolvedOptions } from './types.js'

const resolve =
  'url' in import.meta ? createRequire(import.meta.url).resolve : require.resolve

export const studio = async (options: ResolvedOptions, isRemote = true) => {
  process.env.TAMAGUI_TARGET = 'web'

  const configWatchPromise = watchTamaguiConfig(options)
  let localServerPromise = new Promise(() => {})
  if (!isRemote) {
    process.env.VITE_IS_LOCAL = '1'

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
        host: options.host,
        port: vitePort,
        hmr: true,
        cors: true,
      },
      plugins: [
        tamaguiPlugin({
          components: ['tamagui'],
        }),
        viteReactPlugin(),
      ],
    })

    // these can be lazy loaded (eventually should put in own process)
    await server.listen()

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

    localServerPromise = new Promise((res) => appServer.on('close', res))

    console.log(`Listening on`, chalk.green(`http://localhost:${serverPort}`))
  } else {
    console.log(
      `Open `,
      chalk.green(`https://studio.tamagui.dev/load`),
      ` to load studio`
    )
  }

  await Promise.allSettled([configWatchPromise, localServerPromise])
}
