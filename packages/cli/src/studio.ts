import { createRequire } from 'module'
import { AddressInfo } from 'net'
import { dirname } from 'path'

import { tamaguiPlugin } from '@tamagui/vite-plugin'
import chalk from 'chalk'
import express from 'express'
import proxy from 'express-http-proxy'
import fs from 'fs-extra'
import morgan from 'morgan'
import { createServer } from 'vite'

import { watchTamaguiConfig } from './tamaguiConfigUtils.js'
import { ResolvedOptions } from './types.js'
import { closeEvent } from './utils.js'

const resolve =
  'url' in import.meta ? createRequire(import.meta.url).resolve : require.resolve

export const studio = async (options: ResolvedOptions) => {
  const { default: getPort } = await import('get-port')
  const { paths } = options
  const root = dirname(resolve('@takeout/studio/entry'))
  const server = await createServer({
    root,
    server: {
      // open: true,
      host: options.host,
    },
    plugins: [
      tamaguiPlugin({
        components: ['tamagui'],
      }),
    ],
  })

  // these can be lazy loaded (eventually should put in own process)
  await Promise.all([
    server.listen(),
    //
    watchTamaguiConfig(options),
    // generateTypes(options),
  ])

  const info = server.httpServer?.address() as AddressInfo
  console.log('devServerInfo', info)

  const port = await getPort({
    port: info.port + 1,
  })

  const app = express()

  app.disable('x-powered-by')
  app.use(express.static(paths.dotDir, { maxAge: '2h' }))
  app.use(morgan('tiny'))

  app.get('/conf', async (req, res) => {
    const conf = await fs.readJSON(paths.conf)
    res.status(200).json(conf)
  })

  app.use('/', proxy(`${info.address}:${info.port}`))

  app.listen(port)

  console.log(`Listening on`, chalk.green(`http://localhost:${port}`))

  await closeEvent(server)
}
