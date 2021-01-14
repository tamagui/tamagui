import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import { MediaQueries, mediaObjectToString } from '@snackui/node'
import { ViewStyle } from 'react-native'

import { MEDIA_SEP } from '../constants'
import { getStylesAtomic } from '../css/getStylesAtomic'
import { StyleObject, Ternary } from '../types'
import { isInsideSnackUI, isPresent } from './extractHelpers'

export function extractMediaStyle(
  ternary: Ternary,
  jsxPath: NodePath<t.JSXElement>,
  mediaQueries: MediaQueries,
  sourceFileName: string,
  shouldPrintDebug = false
) {
  // for now order first strongest
  const mediaKeys = Object.keys(mediaQueries)
  const mediaKeysLen = mediaKeys.length
  const mediaKeyPrecendence = mediaKeys.reduce((acc, cur, i) => {
    acc[cur] = new Array(mediaKeysLen - i).fill(':root').join('')
    return acc
  }, {})
  const result = getMediaQueryTernary(ternary, jsxPath, sourceFileName)
  if (!result) {
    return null
  }
  const { key, bindingName } = result
  const mq = mediaQueries[key]
  if (!mq) {
    console.error(
      `Media query "${key}" not found: ${Object.keys(mediaQueries)}`
    )
    return null
  }
  const getStyleObj = (styleObj: ViewStyle | null, negate = false) => {
    return styleObj ? { styleObj, negate } : null
  }
  const styleOpts = [
    getStyleObj(ternary.consequent, false),
    getStyleObj(ternary.alternate, true),
  ].filter(isPresent)
  if (shouldPrintDebug && !styleOpts.length) {
    console.log('  media query, no styles?')
    return null
  }
  let all: StyleObject[] = []
  for (const { styleObj, negate } of styleOpts) {
    const styles = getStylesAtomic(styleObj, null, shouldPrintDebug)
    const mediaStyles = styles.map((style) => {
      const negKey = negate ? '0' : ''
      const ogPrefix = style.identifier.slice(
        0,
        style.identifier.indexOf('-') + 1
      )
      // adds an extra separator before and after to detect later in concatClassName
      // so it goes from: "_f-[hash]"
      // to: "_f-_sm_not_[hash]"
      const identifier = `${style.identifier.replace(
        ogPrefix,
        `${ogPrefix}${MEDIA_SEP}${key}${negKey}${MEDIA_SEP}`
      )}`
      const className = `.${identifier}`
      const mediaSelector = mediaObjectToString(mediaQueries[key])
      const screenStr = negate ? ' not' : ''
      const mediaStr = `@media${screenStr} screen and ${mediaSelector}`
      const precendencePrefix = mediaKeyPrecendence[key]
      const styleInner = `${precendencePrefix} ${style.rules[0].replace(
        style.identifier,
        identifier
      )}`
      const styleRule = `${mediaStr} { ${styleInner} }`
      return {
        ...style,
        identifier,
        className,
        rules: [styleRule],
      }
    })
    // add to output
    if (shouldPrintDebug) {
      console.log('  media style:', mediaStyles)
    }
    all = [...all, ...mediaStyles]
  }
  // filter out
  ternary.remove()
  return all
}

function getMediaQueryTernary(
  ternary: Ternary,
  jsxPath: NodePath<t.JSXElement>,
  sourceFileName: string
) {
  // const media = useMedia()
  // ... media.sm
  if (
    t.isMemberExpression(ternary.test) &&
    t.isIdentifier(ternary.test.object) &&
    t.isIdentifier(ternary.test.property)
  ) {
    const name = ternary.test.object.name
    const key = ternary.test.property.name
    if (!jsxPath.scope.hasBinding(name)) return false
    const bindingNode = jsxPath.scope.getBinding(name)?.path?.node
    if (!t.isVariableDeclarator(bindingNode) || !bindingNode.init) return false
    if (!isValidMediaCall(jsxPath, bindingNode.init, sourceFileName))
      return false
    return { key, bindingName: name }
  }
  // const { sm } = useMedia()
  // ... sm
  if (t.isIdentifier(ternary.test)) {
    const key = ternary.test.name
    const node = jsxPath.scope.getBinding(ternary.test.name)?.path?.node
    if (!t.isVariableDeclarator(node)) return false
    if (!node.init || !isValidMediaCall(jsxPath, node.init, sourceFileName))
      return false
    return { key, bindingName: key }
  }
  return false
}

export function isValidMediaCall(
  jsxPath: NodePath<t.JSXElement>,
  init: t.Expression,
  sourceFileName: string
) {
  if (!t.isCallExpression(init)) return false
  if (!t.isIdentifier(init.callee)) return false
  // TODO could support renaming useMedia by looking up import first
  if (init.callee.name !== 'useMedia') return false
  if (!jsxPath.scope.hasBinding('useMedia')) return false
  const useMediaImport = jsxPath.scope.getBinding('useMedia')?.path.parent
  if (!t.isImportDeclaration(useMediaImport)) return false
  if (useMediaImport.source.value !== 'snackui') {
    if (!isInsideSnackUI(sourceFileName)) {
      return false
    }
  }
  return true
}
