import path from 'path'

import MagicString from 'magic-string'
import { Plugin, ResolvedConfig, normalizePath } from 'vite'

const UNAGI_ENTRY_FILE = 'unagi-entry-client.jsx'

export default () => {
  let config: ResolvedConfig
  return {
    name: 'vite-plugin-hydration-auto-import',
    enforce: 'pre',
    configResolved(_config) {
      config = _config
    },
    resolveId(id, importer) {
      if (
        (/^\/?@tamagui\/unagi\/entry-client$/.test(id) ||
          id.endsWith(path.sep + UNAGI_ENTRY_FILE)) &&
        normalizePath(importer || '').endsWith('/index.html')
      ) {
        // Make this virtual import look like a local project file
        // to enable React Refresh normally.
        return path.join(config.root, UNAGI_ENTRY_FILE + '?virtual')
      }

      return null
    },
    load(id) {
      if (id.includes(UNAGI_ENTRY_FILE + '?virtual')) {
        const code = new MagicString(
          `import renderUnagi from '@tamagui/unagi/entry-client';\n` +
            `export default renderUnagi((props) => props.children);`
        )

        return {
          code: code.toString(),
          map: { mappings: '' },
        }
      }

      return null
    },
  } as Plugin
}
