import { readFileSync } from 'fs'
import { join } from 'path'

import type { Plugin } from 'vite'

export default () => {
  return {
    name: 'vite-plugin-ssr-interop',
    enforce: 'pre',
    transform(code, id, options = {}) {
      if (options.ssr && id.includes('foundation/ssrInterop')) {
        const serverPath = join(
          __dirname,
          '..',
          '..',
          '..',
          'esm',
          'foundation',
          'ssrInteropServer.js'
        )
        const code = readFileSync(serverPath, 'utf-8')
        return {
          code,
          map: { mappings: '' },
        }
      }
    },
  } as Plugin
}
