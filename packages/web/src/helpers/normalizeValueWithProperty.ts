/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import { stylePropsUnitless } from '@tamagui/helpers'

import { getAllSelectors } from './insertStyleRule'

// only doing this on web on native it accepts pixel values

export function normalizeValueWithProperty(value: any, property?: string): any {
  let res = value
  if (
    (property === undefined || !(property in stylePropsUnitless)) &&
    typeof value === 'number'
  ) {
    res = `${value}px`
  } else if (property !== undefined) {
    res = `${res}`
  }
  return res
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
  } else if (stylePropsUnitless[key]) {
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
