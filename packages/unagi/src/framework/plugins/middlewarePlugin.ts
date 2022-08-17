import { promises as fs } from 'fs'
import path from 'path'

import bodyParser from 'body-parser'
import { Plugin } from 'vite'

import { InMemoryCache } from '../cache.js'
import { unagiMiddleware } from '../middleware.js'
import { UNAGI_DEFAULT_SERVER_ENTRY } from './virtualFilesPlugin.js'

export default (pluginOptions: any) => {
  return {
    name: 'unagi:middleware',
    /**
     * By adding a middleware to the Vite dev server, we can handle SSR without needing
     * a custom node script. It works by handling any requests for `text/html` documents,
     * loading them in an SSR context, rendering them using the `entry-server` endpoint in the
     * user's project, and injecting the static HTML into the template.
     */
    async configureServer(server) {
      const resolve = (p: string) => path.resolve(server.config.root, p)
      async function getIndexTemplate(url: string) {
        const indexHtml = await fs.readFile(resolve('index.html'), 'utf-8')
        return await server.transformIndexHtml(url, indexHtml)
      }

      server.middlewares.use(bodyParser.raw({ type: '*/*' }))

      return () =>
        server.middlewares.use(
          unagiMiddleware({
            dev: true,
            indexTemplate: getIndexTemplate,
            getServerEntrypoint: () => server.ssrLoadModule(UNAGI_DEFAULT_SERVER_ENTRY),
            devServer: server,
            cache: pluginOptions?.devCache ? (new InMemoryCache() as unknown as Cache) : undefined,
          })
        )
    },
  } as Plugin
}
