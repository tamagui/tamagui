import reactServerDomVite from '@tamagui/unagi/vendor/react-server-dom-vite/plugin.js'

import type { UnagiVitePluginOptions } from '../types.js'
import { UNAGI_DEFAULT_SERVER_ENTRY, VIRTUAL_PROXY_UNAGI_ROUTES_ID } from './virtualFilesPlugin.js'

export default function (options?: UnagiVitePluginOptions) {
  return reactServerDomVite({
    serverBuildEntries: [UNAGI_DEFAULT_SERVER_ENTRY, VIRTUAL_PROXY_UNAGI_ROUTES_ID],
    isServerComponentImporterAllowed(importer: string, source: string) {
      return (
        // Always allow the entry server (e.g. App.server.jsx) to be imported
        // in other files such as worker.js or server.js.
        source.includes(UNAGI_DEFAULT_SERVER_ENTRY) ||
        /(index|entry-server|unagi\.config)\.[jt]s/.test(importer) ||
        // Support importing server components for testing
        // TODO: revisit this when RSC splits into two bundles
        /\.test\.[tj]sx?$/.test(importer)
      )
    },
    ...options,
  })
}
