import { join, relative } from 'path'

import resolve from 'esm-resolve'
import * as fsExtra from 'fs-extra'

export async function getVitePath(
  importer: string,
  moduleName: string,
  absolute = false
) {
  // our virtual modules
  if (moduleName === 'react-native') {
    return 'react-native'
  }
  if (moduleName === 'react') {
    return 'react'
  }
  if (moduleName === 'react/jsx-runtime') {
    return 'react/jsx-runtime'
  }
  if (moduleName === 'react/jsx-dev-runtime') {
    return 'react/jsx-dev-runtime'
  }

  if (moduleName[0] === '.') {
    // hardcode for now. :/
    return join(`apps/tamastack/src`, moduleName) + '.js'
  }

  const sourceFile = join(process.cwd(), 'index.js')
  const resolved = resolve(sourceFile)(moduleName)
  // figure out symlinks
  if (!resolved) {
    throw new Error(`❌ cant find`)
  }
  const real = await fsExtra.realpath(resolved)
  let id = real
  if (!absolute) {
    id = relative(importer, real)
  }
  if (id.endsWith(`/react/jsx-dev-runtime.js`)) {
    id = 'react/jsx-runtime'
  }
  return id
}
