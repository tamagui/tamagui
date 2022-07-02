import path from 'path'

import * as fs from 'fs-extra'

// were patching react-native-web so we can use some internal methods
// we do it this way because we need to rely on webpack or bundler config to determine cjs vs esm
// so we can't just require it all directly
// would be nice in the future to be able to eject from react-native-web entirely optionally

const PATCH_PREFIX = 'tamagui-patch-'
const PATCH_VERSION = `${PATCH_PREFIX}-v5`
const PATCH_COMMENT = `// ${PATCH_VERSION}`
const PATCH_END_COMMENT = `// tamagui-patch-end`

// keep it sync
export function patchReactNativeWeb(dir: string = require.resolve('react-native-web')) {
  const rootDir = dir.replace(/[\/\\]dist.*/, '')

  const pkgJSON = fs.readJSONSync(path.join(rootDir, 'package.json'))
  if (pkgJSON.version.split('.')[1] !== '18') {
    console.error(
      `⛔️ Error! Tamagui as of beta 69 only works with react-native-web version 0.18.x`,
      pkgJSON.version
    )
    process.exit(1)
  }

  // patch exports for tamagui
  const modulePath = path.join(rootDir, 'dist', 'tamagui-exports.js')
  const cjsPath = path.join(rootDir, 'dist', 'cjs', 'tamagui-exports.js')
  const alreadyPatchedImports =
    fs.existsSync(modulePath) &&
    fs.readFileSync(modulePath, 'utf-8') === moduleExports &&
    fs.existsSync(cjsPath) &&
    fs.readFileSync(cjsPath, 'utf-8') === cjsExports

  if (!alreadyPatchedImports) {
    console.log('      | patch ' + path.relative(rootDir, modulePath))
    fs.writeFileSync(modulePath, moduleExports)
    console.log('      | patch ' + path.relative(rootDir, cjsPath))
    fs.writeFileSync(cjsPath, cjsExports)
  }

  const patches = [
    {
      target: path.join(rootDir, 'dist', 'modules', 'createDOMProps', 'index.js'),
      patched: path.join(__dirname, '..', '..', 'patches', '18', 'createDOMProps.js'),
    },
    {
      target: path.join(rootDir, 'dist', 'cjs', 'modules', 'createDOMProps', 'index.js'),
      patched: path.join(__dirname, '..', '..', 'patches', '18', 'createDOMProps.cjs.js'),
    },
    {
      target: path.join(rootDir, 'dist', 'exports', 'Dimensions', 'index.js'),
      patched: path.join(__dirname, '..', '..', 'patches', '18', 'Dimensions_index.js'),
    },
    {
      target: path.join(rootDir, 'dist', 'cjs', 'exports', 'Dimensions', 'index.js'),
      patched: path.join(__dirname, '..', '..', 'patches', '18', 'Dimensions_index.cjs.js'),
    },
  ]

  for (const { target, patched } of patches) {
    const patchedSrc = fs.readFileSync(patched, 'utf-8')
    if (fs.readFileSync(target, 'utf-8') !== patchedSrc) {
      // fs.moveSync(target, `${target}.bak`) // could exist already and fail
      fs.writeFileSync(target, patchedSrc)
      console.log(`      | patched `, path.relative(rootDir, target))
    }
  }

  // export tamagui exports from root
  const moduleEntry = path.join(rootDir, 'dist', 'index.js')
  const moduleEntrySrc = fs.readFileSync(moduleEntry, 'utf-8')
  if (!moduleEntrySrc.includes(PATCH_COMMENT)) {
    fs.writeFileSync(
      moduleEntry,
      `${removePatch(moduleEntrySrc)}

${PATCH_COMMENT}
import * as TExports from './tamagui-exports'
export const TamaguiExports = TExports
${PATCH_END_COMMENT}
`
    )
  }
  const cjsEntry = path.join(rootDir, 'dist', 'cjs', 'index.js')
  const cjsEntrySrc = fs.readFileSync(cjsEntry, 'utf-8')
  if (!cjsEntrySrc.includes(PATCH_COMMENT)) {
    fs.writeFileSync(
      cjsEntry,
      `${removePatch(cjsEntrySrc)}

${PATCH_COMMENT}
exports.TamaguiExports = require("./tamagui-exports");
${PATCH_END_COMMENT}
`
    )
  }
}

function removePatch(source: string) {
  return source.replace(/\/\/ tamagui-patch([.\s\S]*)/g, '')
}

const moduleExports = `
export { default as createDOMProps } from './modules/createDOMProps'
export { default as TextAncestorContext } from './exports/Text/TextAncestorContext'
export { default as useElementLayout } from './modules/useElementLayout'
export { default as useMergeRefs } from './modules/useMergeRefs'
export { default as usePlatformMethods } from './modules/usePlatformMethods'
export { default as useResponderEvents } from './modules/useResponderEvents'
`

const cjsExports = `
exports.createDOMProps = require('./modules/createDOMProps')
exports.TextAncestorContext = require('./exports/Text/TextAncestorContext')
exports.useElementLayout = require('./modules/useElementLayout')
exports.useMergeRefs = require('./modules/useMergeRefs')
exports.usePlatformMethods = require('./modules/usePlatformMethods')
exports.useResponderEvents = require('./modules/useResponderEvents')
`
