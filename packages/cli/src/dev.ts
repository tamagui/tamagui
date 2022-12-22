import { AddressInfo } from 'net'
import { join } from 'path'

import chalk from 'chalk'
import express from 'express'
import proxy from 'express-http-proxy'
import fs from 'fs-extra'
import morgan from 'morgan'
import { createServer } from 'vite'

import { watchTamaguiConfig } from './tamaguiConfigUtils.js'
import { ResolvedOptions } from './types.js'
import { closeEvent } from './utils.js'

export const dev = async (options: ResolvedOptions) => {
  const { root, mode, paths } = options

  process.chdir(process.cwd())

  const server = await createServer({
    root,
    server: {
      port: options.port,
      host: options.host || 'localhost',
    },
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

  app.use('/', proxy(`${info.address}:${info.port}`))

  // react native port
  const port = 8081
  app.listen(port)

  // eslint-disable-next-line no-console
  console.log(`Listening on`, chalk.green(`http://localhost:${port}`))
  server.printUrls()

  await closeEvent(server)
}
