import type { Plugin } from 'vite'

export default function clientImportsPlugin(): Plugin {
  return {
    name: 'unagi:client-imports',

    enforce: 'pre',

    /**
     * When importer does not end in `server.jsx`, and source is `@tamagui/unagi`,
     * replace with `@tamagui/unagi/client`. This prevents other server-only imports
     * from "leaking" into the client bundle.
     */
    async resolveId(source, importer, { ssr }) {
      if (ssr) return
      if (/\.server\.(j|t)sx?/.test(importer ?? '')) return
      if ('@tamagui/unagi' !== source) return

      const resolution = await this.resolve('@tamagui/unagi/client', importer, {
        skipSelf: true,
      })

      if (resolution) {
        return resolution.id
      }
    },
  }
}
