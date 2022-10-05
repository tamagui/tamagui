import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import { TamaguiInternalConfig, getStylesAtomic, mediaObjectToString } from '@tamagui/core-node'
import type { ViewStyle } from 'react-native'

import { MEDIA_SEP } from '../constants.js'
import type { StyleObject, TamaguiOptionsWithFileInfo, Ternary } from '../types.js'
import { isPresent, isValidImport } from './extractHelpers.js'

export function extractMediaStyle(
  props: TamaguiOptionsWithFileInfo,
  ternary: Ternary,
  jsxPath: NodePath<t.JSXElement>,
  tamaguiConfig: TamaguiInternalConfig,
  sourcePath: string,
  importance = 0,
  shouldPrintDebug: boolean | 'verbose' = false
) {
  const mt = getMediaQueryTernary(props, ternary, jsxPath, sourcePath)
  if (!mt) {
    return null
  }
  const { key } = mt
  const mq = tamaguiConfig.media[key]
  if (!mq) {
    // eslint-disable-next-line no-console
    console.error(`Media query "${key}" not found: ${Object.keys(tamaguiConfig.media)}`)
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
    // eslint-disable-next-line no-console
    console.log('  media query, no styles?')
    return null
  }
  // for now order first strongest
  const mediaKeys = Object.keys(tamaguiConfig.media)
  const mediaKeyPrecendence = mediaKeys.reduce((acc, cur, i) => {
    acc[cur] = new Array(importance + 1).fill(':root').join('')
    return acc
  }, {})
  let mediaStyles: StyleObject[] = []
  for (const { styleObj, negate } of styleOpts) {
    const styles = getStylesAtomic(styleObj)
    const singleMediaStyles = styles.map((style) => {
      const negKey = negate ? '0' : ''
      const ogPrefix = style.identifier.slice(0, style.identifier.indexOf('-') + 1)
      // adds an extra separator before and after to detect later in concatClassName
      // so it goes from: "_f-[hash]"
      // to: "_f-_sm0_[hash]" or "_f-_sm_[hash]"
      const identifier = `${style.identifier.replace(
        ogPrefix,
        `${ogPrefix}${MEDIA_SEP}${key}${negKey}${MEDIA_SEP}`
      )}`
      const className = `.${identifier}`
      const mediaSelector = mediaObjectToString(tamaguiConfig.media[key])
      const screenStr = negate ? 'not all' : 'screen'
      const mediaQuery = `${screenStr} and ${mediaSelector}`
      const precendencePrefix = mediaKeyPrecendence[key]
      const styleInner = style.rules
        .map((rule) => rule.replace(style.identifier, identifier))
        .join(';')
      // combines media queries if they already exist
      let styleRule = ''
      if (styleInner.includes('@media')) {
        // combine
        styleRule = styleInner.replace('{', ` and ${mediaQuery} {`)
      } else {
        styleRule = `@media ${mediaQuery} { ${precendencePrefix} ${styleInner} }`
      }
      return {
        ...style,
        identifier,
        className,
        rules: [styleRule],
      }
    })
    if (shouldPrintDebug === 'verbose') {
      // prettier-ignore
      // eslint-disable-next-line no-console
      console.log('  media styles:', importance, styleObj, singleMediaStyles.map(x => x.identifier).join(', '))
    }
    // add to output
    mediaStyles = [...mediaStyles, ...singleMediaStyles]
  }
  // filter out
  ternary.remove()
  return { mediaStyles, ternaryWithoutMedia: mt.ternaryWithoutMedia }
}

function getMediaQueryTernary(
  props: TamaguiOptionsWithFileInfo,
  ternary: Ternary,
  jsxPath: NodePath<t.JSXElement>,
  sourcePath: string
): null | {
  key: string
  bindingName: string
  ternaryWithoutMedia: Ternary | null
} {
  // this handles unwrapping logical && media query ternarys
  // first, unwrap if it has media logicalExpression
  if (t.isLogicalExpression(ternary.test) && ternary.test.operator === '&&') {
    // *should* be normalized to always be on left side
    const mediaLeft = getMediaInfoFromExpression(
      props,
      ternary.test.left,
      jsxPath,
      sourcePath,
      ternary.inlineMediaQuery
    )
    if (mediaLeft) {
      return {
        ...mediaLeft,
        ternaryWithoutMedia: {
          ...ternary,
          test: ternary.test.right,
        },
      }
    }
  }
  // const media = useMedia()
  // ... media.sm
  const result = getMediaInfoFromExpression(
    props,
    ternary.test,
    jsxPath,
    sourcePath,
    ternary.inlineMediaQuery
  )
  if (result) {
    return {
      ...result,
      ternaryWithoutMedia: null,
    }
  }
  return null
}

function getMediaInfoFromExpression(
  props: TamaguiOptionsWithFileInfo,
  test: t.Expression,
  jsxPath: NodePath<t.JSXElement>,
  sourcePath: string,
  inlineMediaQuery?: string
) {
  if (inlineMediaQuery) {
    return {
      key: inlineMediaQuery,
      bindingName: inlineMediaQuery,
    }
  }
  if (t.isMemberExpression(test) && t.isIdentifier(test.object) && t.isIdentifier(test.property)) {
    const name = test.object['name']
    const key = test.property['name']
    const bindings = jsxPath.scope.getAllBindings()
    const binding = bindings[name]
    if (!binding) return false
    const bindingNode = binding.path?.node
    if (!t.isVariableDeclarator(bindingNode) || !bindingNode.init) return false
    if (!isValidMediaCall(props, jsxPath, bindingNode.init, sourcePath)) return false
    return { key, bindingName: name }
  }
  if (t.isIdentifier(test)) {
    const key = test.name
    const node = jsxPath.scope.getBinding(test.name)?.path?.node
    if (!t.isVariableDeclarator(node)) return false
    if (!node.init || !isValidMediaCall(props, jsxPath, node.init, sourcePath)) return false
    return { key, bindingName: key }
  }
  return null
}

export function isValidMediaCall(
  props: TamaguiOptionsWithFileInfo,
  jsxPath: NodePath<t.JSXElement>,
  init: t.Expression,
  sourcePath: string
) {
  if (!t.isCallExpression(init)) return false
  if (!t.isIdentifier(init.callee)) return false
  // TODO could support renaming useMedia by looking up import first
  if (init.callee.name !== 'useMedia') return false
  const bindings = jsxPath.scope.getAllBindings()
  const mediaBinding = bindings['useMedia']
  if (!mediaBinding) return false
  const useMediaImport = mediaBinding.path.parent
  if (!t.isImportDeclaration(useMediaImport)) return false
  if (!isValidImport(props, sourcePath)) {
    return false
  }
  return true
}
