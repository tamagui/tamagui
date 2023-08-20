import { join, relative } from 'path'

import resolve from 'esm-resolve'
import { realpath } from 'fs-extra'

export async function getVitePath(importer: string, moduleName: string) {
  if (moduleName[0] === '.') {
    // hardcode for now. :/
    return join(`apps/tamastack/src`, moduleName) + '.js'
  } else {
    const sourceFile = join(process.cwd(), 'index.js')
    const resolved = resolve(sourceFile)(moduleName)
    // figure out symlinks
    if (!resolved) {
      throw new Error(`❌ cant find`)
    }
    const real = await realpath(resolved)
    let id = relative(importer, real)
    if (id.endsWith(`/react/jsx-dev-runtime.js`)) {
      id = 'react/jsx-runtime'
    }
    return id
  }
}
