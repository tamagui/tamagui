import reactPlugin from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import inspect from 'vite-plugin-inspect'

import clientImportsPlugin from './plugins/clientImportsPlugin.js'
import clientMiddlewarePlugin from './plugins/clientMiddlewarePlugin.js'
import configPlugin from './plugins/configPlugin.js'
import hydrationAutoImportPlugin from './plugins/hydrationAutoImportPlugin.js'
import middlewarePlugin from './plugins/middlewarePlugin.js'
import platformEntryPlugin from './plugins/platformEntryPlugin.js'
import ssrInteropPlugin from './plugins/ssrInteropPlugin.js'
import suppressWarningsPlugin from './plugins/suppressWarningsPlugin.js'
import unagiRscPlugin from './plugins/unagiRscPlugin.js'
import virtualFilesPlugin from './plugins/virtualFilesPlugin.js'
import cssModulesRsc from './plugins/vitePluginCSSModulesRSC.js'
import cssRsc from './plugins/vitePluginCSSRSC.js'
import { UnagiVitePluginOptions } from './types.js'

export const unagiPlugin = (
  options: UnagiVitePluginOptions = {
    configPath: 'unagi.config',
  }
) => {
  return [
    process.env.VITE_INSPECT && inspect(),
    configPlugin(),
    clientMiddlewarePlugin(),
    clientImportsPlugin(),
    middlewarePlugin(options),
    virtualFilesPlugin(options),
    reactPlugin({
      jsxPure: true,
    }),
    hydrationAutoImportPlugin(),
    ssrInteropPlugin(),
    options.experimental?.css === 'global' ? cssRsc() : cssModulesRsc(),
    unagiRscPlugin(),
    platformEntryPlugin(),
    suppressWarningsPlugin(),
  ] as Plugin[]
}

// esm support
export default unagiPlugin
