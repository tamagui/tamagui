import type { Plugin } from 'vite'

export function clientImportsPlugin(): Plugin {
  return {
    name: 'hydrogen:client-imports',

    enforce: 'pre',

    /**
     * When importer does not end in `server.jsx`, and source is `@tamagui/hydrogen`,
     * replace with `@tamagui/hydrogen/client`. This prevents other server-only imports
     * from "leaking" into the client bundle.
     */
    async resolveId(source, importer, { ssr }) {
      if (ssr) return
      if (/\.server\.(j|t)sx?/.test(importer ?? '')) return
      if ('@tamagui/hydrogen' !== source) return

      const resolution = await this.resolve('@tamagui/hydrogen/client', importer, {
        skipSelf: true,
      })

      if (resolution) {
        return resolution.id
      }
    },
  }
}
