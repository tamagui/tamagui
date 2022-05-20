import path from 'path'

import * as fs from 'fs-extra'

// were patching react-native-web so we can use some internal methods
// we do it this way because we need to rely on webpack or bundler config to determine cjs vs esm
// so we can't just require it all directly
// would be nice in the future to be able to eject from react-native-web entirely optionally

// keep it sync
export function patchReactNativeWeb(dir: string = require.resolve('react-native-web')) {
  const rootDir = dir.replace(/\/dist.*/, '')
  const modulePath = path.join(rootDir, 'dist', 'tamagui-exports.js')
  const cjsPath = path.join(rootDir, 'dist', 'cjs', 'tamagui-exports.js')
  const shouldPatchExports =
    fs.existsSync(modulePath) &&
    fs.readFileSync(modulePath, 'utf-8') === moduleExports &&
    fs.existsSync(cjsPath) &&
    fs.readFileSync(cjsPath, 'utf-8') === cjsExports
  if (!shouldPatchExports) {
    console.log('      | patch ' + path.relative(rootDir, modulePath))
    console.log('      | patch ' + path.relative(rootDir, cjsPath))
    fs.writeFileSync(modulePath, moduleExports)
    fs.writeFileSync(cjsPath, cjsExports)
  }

  // patch to allow className prop
  const patches = [
    {
      id: 'dom-props',
      filePath: ['modules', 'createDOMProps', 'index.js'],
      replacee: `  if (dataSet != null) {`,
      replacer: `
  if (props.dataSet && props.dataSet.className) {
    const { className, ...dataSetRest } = props.dataSet
    classList = className
    dataSet = dataSetRest
  }
  if (props.dataSet && props.dataSet.id) {
    domProps['id'] = props.dataSet.id
  }
  if (dataSet != null) {`,
    },
    {
      id: 'forward-props',
      filePath: ['modules', 'forwardedProps', 'index.js'],
      replacee: `dataSet: true,`,
      replacer: `id: true, dataSet: true,`,
    },
  ]

  for (const { filePath, replacee, replacer } of patches) {
    const files = [
      path.join(rootDir, 'dist', ...filePath),
      path.join(rootDir, 'dist', 'cjs', ...filePath),
    ]
    for (const file of files) {
      const contents = fs.readFileSync(file, 'utf-8')
      if (contents.includes(replacer)) {
        continue
      }
      if (!contents.includes(replacee)) {
        console.warn(
          `⚠️ Error: couldn't apply className patch! Maybe using incompatible react-native-web version.`,
          {
            replacee,
            contents,
          }
        )
        continue
      }
      console.log('      | patch ' + path.relative(rootDir, file))
      fs.writeFileSync(file, contents.replace(replacee, replacer))
    }
  }

  // if entry files not patched, patch them:
  const moduleEntry = path.join(rootDir, 'dist', 'index.js')
  const moduleEntrySrc = fs.readFileSync(moduleEntry, 'utf-8')
  if (!moduleEntrySrc.includes('// tamagui-patch-v4')) {
    fs.writeFileSync(
      moduleEntry,
      `${removePatch(moduleEntrySrc)}

// tamagui-patch-v4
import * as TExports from './tamagui-exports'
export const TamaguiExports = TExports
// tamagui-patch-end
`
    )
  }
  const cjsEntry = path.join(rootDir, 'dist', 'cjs', 'index.js')
  const cjsEntrySrc = fs.readFileSync(cjsEntry, 'utf-8')
  if (!cjsEntrySrc.includes('// tamagui-patch-v4')) {
    fs.writeFileSync(
      cjsEntry,
      `${removePatch(cjsEntrySrc)}

// tamagui-patch-v4
exports.TamaguiExports = _interopRequireDefault(require("./tamagui-exports"));
// tamagui-patch-end
`
    )
  }
}

function removePatch(source: string) {
  return source.replace(/\/\/ tamagui-patch([.\s\S]*)/g, '')
}

// view exports/View.ts
const forwardedPropsObj = `{
  ...fwdProps.defaultProps,
  ...fwdProps.accessibilityProps,
  ...fwdProps.clickProps,
  ...fwdProps.focusProps,
  ...fwdProps.keyboardProps,
  ...fwdProps.mouseProps,
  ...fwdProps.touchProps,
  ...fwdProps.styleProps,
  href: true,
  lang: true,
  onScroll: true,
  onWheel: true,
  pointerEvents: true
}
`

const moduleExports = `
export { atomic } from './exports/StyleSheet/compile'
export { default as createCompileableStyle } from './exports/StyleSheet/createCompileableStyle'
export { default as createReactDOMStyle } from './exports/StyleSheet/createReactDOMStyle'
export { default as i18Style } from './exports/StyleSheet/i18nStyle'
export { default as createDOMProps } from './modules/createDOMProps'
export { default as AccessibilityUtil } from './modules/AccessibilityUtil'
export { default as createElement } from './exports/createElement'
export { default as css } from './exports/StyleSheet/css'
export { default as TextAncestorContext } from './exports/Text/TextAncestorContext'
export { default as pick } from './modules/pick'
export { default as useElementLayout } from './modules/useElementLayout'
export { default as useMergeRefs } from './modules/useMergeRefs'
export { default as usePlatformMethods } from './modules/usePlatformMethods'
export { default as useResponderEvents } from './modules/useResponderEvents'
import * as fwdProps from './modules/forwardedProps'
export const forwardedProps = ${forwardedPropsObj}
`

const cjsExports = `
exports.atomic = require('./exports/StyleSheet/compile').atomic
exports.createCompileableStyle = require('./exports/StyleSheet/createCompileableStyle')
exports.createReactDOMStyle = require('./exports/StyleSheet/createReactDOMStyle')
exports.i18Style = require('./exports/StyleSheet/i18nStyle')
exports.createDOMProps = require('./modules/createDOMProps')
exports.AccessibilityUtil = require('./modules/AccessibilityUtil')
exports.createElement = require('./exports/createElement')
exports.css = require('./exports/StyleSheet/css')
exports.TextAncestorContext = require('./exports/Text/TextAncestorContext')
exports.pick = require('./modules/pick')
exports.useElementLayout = require('./modules/useElementLayout')
exports.useMergeRefs = require('./modules/useMergeRefs')
exports.usePlatformMethods = require('./modules/usePlatformMethods')
exports.useResponderEvents = require('./modules/useResponderEvents')
const fwdProps = require('./modules/forwardedProps')
exports.forwardedProps = ${forwardedPropsObj}
`
