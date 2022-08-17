import '../utilities/webPolyfill.js'

import path from 'path'

import bodyParser from 'body-parser'
import compression from 'compression'
import connect, { NextHandleFunction } from 'connect'
import serveStatic from 'serve-static'

import { InMemoryCache } from '../framework/cache.js'
import { unagiMiddleware } from '../framework/middleware.js'
import { handleRequest, indexTemplate, relativeClientBuildPath } from './virtual.js'

type CreateServerOptions = {
  cache?: Cache
}

export async function createServer({ cache = new InMemoryCache() }: CreateServerOptions = {}) {
  globalThis.Oxygen = { env: process.env }

  const app = connect()

  app.use(compression() as NextHandleFunction)

  app.use(
    serveStatic(path.resolve(__dirname, relativeClientBuildPath), {
      index: false,
    }) as NextHandleFunction
  )

  app.use(bodyParser.raw({ type: '*/*' }))

  app.use(
    unagiMiddleware({
      getServerEntrypoint: () => handleRequest,
      indexTemplate,
      cache,
    })
  )

  return { app }
}

if (require.main === module) {
  createServer().then(({ app }) => {
    const port = process.env.PORT || 8080
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Unagi server running at http://localhost:${port}`)
    })
  })
}
