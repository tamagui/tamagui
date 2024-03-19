import { createRequire } from 'module'
import type { AddressInfo } from 'net'
import { dirname, join } from 'path'

import { watchTamaguiConfig } from '@tamagui/static'
import type { CLIResolvedOptions } from '@tamagui/types'
import { tamaguiExtractPlugin, tamaguiPlugin } from '@tamagui/vite-plugin'
import viteReactPlugin from '@vitejs/plugin-react-swc'
import chalk from 'chalk'
import express from 'express'
import fs, { ensureDir } from 'fs-extra'
import { createProxyMiddleware } from 'http-proxy-middleware'
import type { InlineConfig } from 'vite'
import { build, createServer } from 'vite'
import entryShakingPlugin from 'vite-plugin-entry-shaking'
import viteInspect from 'vite-plugin-inspect'
import viteTsConfigPaths from 'vite-tsconfig-paths'

const resolve =
  'url' in import.meta ? createRequire(import.meta.url).resolve : require.resolve

export const studio = async (
  options: CLIResolvedOptions,
  isRemote = false,
  isBuild = false
) => {
  await ensureDir(options.paths.dotDir)
  const configWatchPromise = watchTamaguiConfig(options.tamaguiOptions)

  let localServerPromise = new Promise(() => {})
  if (!isRemote) {
    process.env.VITE_IS_LOCAL = '1'

    process.stdout.on('error', (err) => {
      if (err.code == 'EPIPE') {
        process.exit(0)
      }
    })

    const { default: getPort } = await import('get-port')
    const { paths } = options
    const root = dirname(dirname(resolve('@tamagui/studio')))

    const [serverPort, vitePort] = await Promise.all([
      getPort({
        port: 1421,
      }),
      getPort({
        port: 1422,
      }),
    ])

    const targets = [
      resolve('@tamagui/lucide-icons').replace('/dist/cjs/index.js', ''),
      resolve('@tamagui/demos').replace('/dist/cjs/index.js', ''),
    ]

    const viteConfig = {
      root,
      server: {
        host: options.host,
        port: vitePort,
        hmr: true,
        cors: true,
      },
      build: {
        rollupOptions: {},
      },
      plugins: [
        viteReactPlugin({
          tsDecorators: true,
        }),
        tamaguiPlugin({
          components: ['tamagui'],
        }),
        tamaguiExtractPlugin({
          config: './src/tamagui.config.ts',
          disableExtraction: true,
          components: ['tamagui'],
        }),
        viteTsConfigPaths(),
        await entryShakingPlugin({
          targets,
        }),
        viteInspect(),
      ],
      define: {
        'process.env.TAMAGUI_KEEP_THEMES': 'true',
        global: 'window',
      },
    } satisfies InlineConfig

    if (isBuild) {
      return await build(viteConfig)
    }

    const server = await createServer(viteConfig)

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
