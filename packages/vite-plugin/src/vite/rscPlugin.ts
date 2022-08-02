import {
  TAMAGUI_DEFAULT_SERVER_ENTRY,
  VIRTUAL_PROXY_TAMAGUI_ROUTES_ID,
} from '../framework/plugins/virtualFilesPlugin.js'
// @ts-ignore
import reactServerDomVite from '../vendor/react-server-dom-vite/plugin.js'

export default function (options?: any) {
  return reactServerDomVite({
    serverBuildEntries: [TAMAGUI_DEFAULT_SERVER_ENTRY, VIRTUAL_PROXY_TAMAGUI_ROUTES_ID],
    isServerComponentImporterAllowed(importer: string, source: string) {
      return (
        // Always allow the entry server (e.g. App.server.jsx) to be imported
        // in other files such as worker.js or server.js.
        source.includes(TAMAGUI_DEFAULT_SERVER_ENTRY) ||
        /(index|entry-server|tamagui\.config)\.[jt]s/.test(importer) ||
        // Support importing server components for testing
        // TODO: revisit this when RSC splits into two bundles
        /\.test\.[tj]sx?$/.test(importer)
      )
    },
    ...options,
  })
}
