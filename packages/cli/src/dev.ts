import { AddressInfo } from 'net'
import { join } from 'path'

import { nativePlugin, tamaguiPlugin } from '@tamagui/vite-plugin'
import chalk from 'chalk'
import express from 'express'
import proxy from 'express-http-proxy'
import fs from 'fs-extra'
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

  app.disable('x-powered-by')
  app.use(express.static(paths.dotDir, { maxAge: '2h' }))
  app.use(morgan('tiny'))

  // studio specific - move out eventually to studioPlugin

  app.get('/conf', async (req, res) => {
    const conf = await fs.readJSON(paths.conf)
    res.status(200).json(conf)
  })

  // /index.bundle?platform=ios&dev=true&minify=false&modulesOnly=false&runModule=true&app=dish.motion:2811:36)
  app.get('/index.bundle', async (req, res) => {
    const output = (await fs.readFile(outputJsPath)).toString()
    res.status(200).send(output)
  })

  app.use('/', proxy(`${info.address}:${info.port}`))

  // react native port
  const port = 8081
  app.listen(port)

  // eslint-disable-next-line no-console
  console.log(`Listening on`, chalk.green(`http://localhost:${port}`))
  server.printUrls()

  process.on('beforeExit', () => {
    server.close()
  })

  await closeEvent(server)
}
