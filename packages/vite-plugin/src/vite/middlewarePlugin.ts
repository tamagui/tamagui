import { promises as fs } from 'fs'
import path from 'path'

import bodyParser from 'body-parser'
import { Plugin, ResolvedConfig, loadEnv } from 'vite'

import { InMemoryCache } from '../framework/cache.js'
import { tamaguiMiddleware } from '../framework/middleware.js'
import {
  TAMAGUI_DEFAULT_SERVER_ENTRY,
  VIRTUAL_PROXY_TAMAGUI_CONFIG_ID,
} from '../framework/plugins/virtualFilesPlugin.js'

export const middlewarePlugin = (pluginOptions: any) => {
  return {
    name: 'tamagui:middleware',
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

      await polyfillOxygenEnv(server.config)

      server.middlewares.use(bodyParser.raw({ type: '*/*' }))

      return () =>
        server.middlewares.use(
          tamaguiMiddleware({
            dev: true,
            indexTemplate: getIndexTemplate,
            getServerEntrypoint: () => server.ssrLoadModule(TAMAGUI_DEFAULT_SERVER_ENTRY),
            devServer: server,
            cache: pluginOptions?.devCache ? (new InMemoryCache() as unknown as Cache) : undefined,
          })
        )
    },
  } as Plugin
}

declare global {
  // eslint-disable-next-line no-var
  var Oxygen: { env: any; [key: string]: any }
}

async function polyfillOxygenEnv(config: ResolvedConfig) {
  const env = await loadEnv(config.mode, config.root, '')

  const publicPrefixes = Array.isArray(config.envPrefix)
    ? config.envPrefix
    : [config.envPrefix || '']

  for (const key of Object.keys(env)) {
    if (publicPrefixes.some((prefix) => key.startsWith(prefix))) {
      delete env[key]
    }
  }

  globalThis.Oxygen = { env }
}
