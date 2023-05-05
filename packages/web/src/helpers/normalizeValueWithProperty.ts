/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import { isWeb } from '@tamagui/constants'

import { getAllSelectors } from './insertStyleRule'
import { names, normalizeColor } from './normalizeColor'
import { normalizeStylePropKeys } from './normalizeStylePropKeys'

const colorCache = new Map()

export function normalizeValueWithProperty(value: any, property?: string): any {
  if (property && property in unitlessNumbers) {
    return value
  }
  let res = value
  if (property && (property in normalizeStylePropKeys || value in names)) {
    if (colorCache.has(value)) {
      return colorCache.get(value)
    }
    res = normalizeColor(value)
    // avoid memory pressure
    if (colorCache.size > 1000) {
      colorCache.clear()
    }
    colorCache.set(value, res)
  } else if (
    isWeb &&
    typeof value === 'number' &&
    (property === undefined ||
      !(property in unitlessNumbers || property in stringNumbers))
  ) {
    res = `${value}px`
  } else if (isWeb && property !== undefined && property in stringNumbers) {
    res = `${res}`
  }
  return res
}

const stringNumbers = {
  zIndex: true,
}

const unitlessNumbers = {
  WebkitLineClamp: true,
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexOrder: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  fontWeight: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowGap: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnGap: true,
  gridColumnStart: true,
  lineClamp: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zoom: true,
  scale: true,
  scaleX: true,
  scaleY: true,
  scaleZ: true,
  shadowOpacity: true,
}

// getting real values for colors for animations (reverse mapped from CSS)
// this isn't beautiful, but will do relatively fine performance for now
const rcache = {}
export function reverseMapClassNameToValue(key: string, className: string) {
  const selectors = getAllSelectors()
  const cssRule = selectors[className]
  if (rcache[cssRule]) {
    return rcache[cssRule]
  }

  if (!cssRule) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `No CSS rule found for ${key} looking for selector ".${className}", you may not be injecting extracted CSS`
      )
    }
    return
  }
  const cssVal = cssRule.replace(/.*:/, '').replace(/;.*/, '').trim()
  let res: any
  if (cssVal.startsWith('var(')) {
    res = cssVal
  } else if (unitlessNumbers[key]) {
    res = +cssVal
  } else if (cssVal.endsWith('px')) {
    res = +cssVal.replace('px', '')
  } else {
    res = cssVal
  }
  rcache[cssRule] = res
  if (process.env.NODE_ENV === 'development') {
    // ensure we are parsing properly
    if (typeof res === 'number' && isNaN(res)) {
      // rome-ignore lint/nursery/noConsoleLog: ok
      console.log('Tamagui invalid parsed value, NaN:', {
        res,
        cssVal,
        cssRule,
        key,
        className,
      })
    }
  }
  return res
}
