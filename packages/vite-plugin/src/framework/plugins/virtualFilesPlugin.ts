import { promises as fs } from 'fs'
import path from 'path'

import { Plugin, ResolvedConfig, ViteDevServer, normalizePath } from 'vite'

import { TamaguiVitePluginOptions } from '../types.js'
import { viteception } from '../viteception.js'

export const TAMAGUI_DEFAULT_SERVER_ENTRY = process.env.TAMAGUI_SERVER_ENTRY || '/src/App.server'

// The character ":" breaks Vite with Node >= 16.15. Use "_" instead
const VIRTUAL_PREFIX = 'virtual__'
const PROXY_PREFIX = 'proxy__'

const ERROR_FILE = 'error.jsx'
const VIRTUAL_ERROR_FILE = VIRTUAL_PREFIX + ERROR_FILE

const TAMAGUI_CONFIG_ID = 'tamagui.config.ts'
const VIRTUAL_TAMAGUI_CONFIG_ID = VIRTUAL_PREFIX + TAMAGUI_CONFIG_ID
export const VIRTUAL_PROXY_TAMAGUI_CONFIG_ID = VIRTUAL_PREFIX + PROXY_PREFIX + TAMAGUI_CONFIG_ID

const TAMAGUI_ROUTES_ID = 'tamagui-routes.server.jsx'
const VIRTUAL_TAMAGUI_ROUTES_ID = VIRTUAL_PREFIX + TAMAGUI_ROUTES_ID
export const VIRTUAL_PROXY_TAMAGUI_ROUTES_ID = VIRTUAL_PREFIX + PROXY_PREFIX + TAMAGUI_ROUTES_ID

export const virtualFilesPlugin = (pluginOptions: TamaguiVitePluginOptions) => {
  let config: ResolvedConfig
  let server: ViteDevServer

  return {
    name: 'tamagui:virtual-files',
    configResolved(_config) {
      config = _config
    },
    configureServer(_server) {
      server = _server
    },
    resolveId(source, importer) {
      if (source === VIRTUAL_TAMAGUI_CONFIG_ID) {
        return findTamaguiConfigPath(config.root, pluginOptions.configPath).then((hcPath: string) =>
          // This direct dependency on a real file
          // makes HMR work for the virtual module.
          this.resolve(hcPath, importer, { skipSelf: true })
        )
      }

      if (
        [
          VIRTUAL_PROXY_TAMAGUI_CONFIG_ID,
          VIRTUAL_PROXY_TAMAGUI_ROUTES_ID,
          VIRTUAL_TAMAGUI_ROUTES_ID,
          VIRTUAL_ERROR_FILE,
        ].includes(source)
      ) {
        // Virtual modules convention
        // https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention

        return '\0' + source
      }
    },
    load(id) {
      // Likely due to a bug in Vite, but virtual modules cannot be loaded
      // directly using ssrLoadModule from a Vite plugin. It needs to be proxied as follows:
      if (id === '\0' + VIRTUAL_PROXY_TAMAGUI_CONFIG_ID) {
        return `import hc from '${VIRTUAL_TAMAGUI_CONFIG_ID}'; export default hc;`
      }
      if (id === '\0' + VIRTUAL_PROXY_TAMAGUI_ROUTES_ID) {
        return `import hr from '${VIRTUAL_TAMAGUI_ROUTES_ID}'; export default hr;`
      }

      if (id === '\0' + VIRTUAL_TAMAGUI_ROUTES_ID) {
        return importTamaguiConfig().then((hc) => {
          let routesPath: string =
            (typeof hc.routes === 'string' ? hc.routes : hc.routes?.files) ?? '/src/routes'

          if (routesPath.startsWith('./')) {
            routesPath = routesPath.slice(1)
          }

          if (!routesPath.includes('*')) {
            if (!routesPath.endsWith('/')) {
              routesPath += '/'
            }

            routesPath += '**/*.server.[jt](s|sx)'
          }

          const [dirPrefix] = routesPath.split('/*')

          let code = `export default {\n  dirPrefix: '${dirPrefix}',\n  basePath: '${
            hc.routes?.basePath ?? ''
          }',\n  files: import.meta.globEager('${routesPath}')\n};`

          if (config.command === 'serve') {
            // Add dependency on Tamagui config for HMR
            code += `\nimport '${VIRTUAL_TAMAGUI_CONFIG_ID}';`
          }

          return { code }
        })
      }

      if (id === '\0' + VIRTUAL_ERROR_FILE) {
        return importTamaguiConfig().then((hc) => {
          const errorPath = hc.serverErrorPage ?? '/src/Error.{jsx,tsx}'
          const code = `const errorPage = import.meta.glob("${errorPath}");\n export default Object.values(errorPage)[0];`
          return { code }
        })
      }
    },
  } as Plugin

  async function importTamaguiConfig() {
    if (server) {
      const loaded = await server.ssrLoadModule(VIRTUAL_PROXY_TAMAGUI_CONFIG_ID)

      return loaded.default
    }

    const { loaded } = await viteception([VIRTUAL_PROXY_TAMAGUI_CONFIG_ID])
    return loaded[0].default
  }
}

async function findTamaguiConfigPath(root: string, userProvidedPath?: string) {
  let configPath = userProvidedPath

  if (!configPath) {
    // Find the config file in the project root
    const files = await fs.readdir(root)
    configPath = files.find((file) => /^tamagui\.config\.[jt]s$/.test(file))
  }

  if (configPath) {
    configPath = normalizePath(configPath)

    if (!configPath.startsWith('/')) configPath = path.resolve(root, configPath)
  }

  return configPath || require.resolve('@shopify/tamagui/utilities/empty-tamagui-config')
}
