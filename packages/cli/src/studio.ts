import { createRequire } from 'module'
import { AddressInfo } from 'net'
import { dirname, join } from 'path'

import { watchTamaguiConfig } from '@tamagui/static'
import { CLIResolvedOptions } from '@tamagui/types'
import { tamaguiPlugin } from '@tamagui/vite-plugin'
import viteReactPlugin from '@vitejs/plugin-react-swc'
import chalk from 'chalk'
import express from 'express'
import fs, { ensureDir } from 'fs-extra'
import {
  Filter,
  Options,
  RequestHandler,
  createProxyMiddleware,
} from 'http-proxy-middleware'
import { createServer } from 'vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'

const resolve =
  'url' in import.meta ? createRequire(import.meta.url).resolve : require.resolve

export const studio = async (options: CLIResolvedOptions, isRemote = false) => {
  process.env.TAMAGUI_TARGET = 'web'

  await ensureDir(options.paths.dotDir)
  const configWatchPromise = watchTamaguiConfig(options.tamaguiOptions)

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
    const root = dirname(dirname(dirname(resolve('@tamagui/studio'))))
    console.log('root', root)

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
        viteTsConfigPaths(),
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

    app.get('/pingz', async (req, res) => {
      res.status(200).json({
        hi: true,
      })
    })

    app.get('/api/tamagui.config.json', async (req, res) => {
      try {
        res.status(200).json(await fs.readJSON(paths.conf))
      } catch (err) {
        res.status(500).json({
          error: `${(err as any).message}`,
        })
      }
    })

    app.get('/api/tamagui.themes.json', async (req, res) => {
      try {
        res.status(200).json(await fs.readJSON(join(paths.dotDir, 'theme-builder.json')))
      } catch (err) {
        res.status(500).json({
          error: `${(err as any).message}`,
        })
      }
    })

    const target = `http://${info.address}:${vitePort}`
    console.log('target', target)
    app.use(
      '/',
      createProxyMiddleware({
        target,
        ws: true,
      })
    )

    const appServer = app.listen(serverPort)

    localServerPromise = new Promise((res) => appServer.on('close', res))

    console.log(`Listening on`, chalk.green(`http://localhost:${serverPort}`))
  } else {
    console.log(`Open `, chalk.green(`https://studio.tamagui.dev`), ` to load studio`)
  }

  await Promise.allSettled([configWatchPromise, localServerPromise])
}
