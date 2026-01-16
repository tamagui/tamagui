/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */

import { isAndroid } from '@tamagui/constants'

import {
  webToNativeDynamicExpansion,
  webToNativeExpansion,
} from '../constants/webToNativeProps'
import type { PropMappedValue } from '../types'

// Parse CSS boxShadow string to RN object array
const num = (v: string) => Number.parseFloat(v) || 0
const parseBoxShadowStr = (s: string) =>
  s.split(/,(?![^(]*\))/).map((sh) => {
    const p = sh.trim().split(/\s+/)
    let i = p[0] === 'inset' ? 1 : 0
    const o: any = { offsetX: num(p[i++]), offsetY: num(p[i++]) }
    if (p[0] === 'inset') o.inset = true
    if (p[i] && /^-?[\d.]/.test(p[i])) o.blurRadius = num(p[i++])
    if (p[i] && /^-?[\d.]/.test(p[i])) o.spreadDistance = num(p[i++])
    if (p[i]) o.color = p.slice(i).join(' ')
    return o
  })

// Parse CSS filter string to RN object array
const simpleFilters = new Set([
  'brightness',
  'opacity',
  'contrast',
  'grayscale',
  'invert',
  'saturate',
  'sepia',
  'blur',
])
const parseFilterStr = (s: string): any[] => {
  const r: any[] = []
  for (const [, fn, val] of s.matchAll(/(\w+)\(([^)]+)\)/g)) {
    const n = +val || 0
    if (simpleFilters.has(fn)) r.push({ [fn]: n })
    else if (fn === 'hueRotate' || fn === 'hue-rotate') r.push({ hueRotate: val })
    else if (fn === 'dropShadow' || fn === 'drop-shadow') {
      const p = val.trim().split(/\s+/)
      const ds: any = { offsetX: num(p[0]), offsetY: num(p[1]) }
      if (p[2] && /^-?[\d.]/.test(p[2])) {
        ds.blurRadius = num(p[2])
        if (p[3]) ds.color = p.slice(3).join(' ')
      } else if (p[2]) ds.color = p.slice(2).join(' ')
      r.push({ dropShadow: ds })
    }
  }
  return r
}

export function expandStyle(key: string, value: any): PropMappedValue {
  if (isAndroid && key === 'elevationAndroid') {
    return [['elevation', value]]
  }

  // Native: convert boxShadow string to object array
  if (key === 'boxShadow') {
    if (typeof value === 'string') {
      return [['boxShadow', parseBoxShadowStr(value)]]
    }
    if (value && !Array.isArray(value)) {
      return [['boxShadow', [value]]]
    }
  }

  // Native: convert filter string to object array
  if (key === 'filter') {
    if (typeof value === 'string') {
      return [['filter', parseFilterStr(value)]]
    }
    if (value && !Array.isArray(value)) {
      return [['filter', [value]]]
    }
  }

  if (key in EXPANSIONS) {
    return EXPANSIONS[key].map((key) => {
      return [key, value]
    })
  }

  if (key in webToNativeExpansion) {
    return webToNativeExpansion[key].map((key) => {
      return [key, value]
    })
  }

  if (key in webToNativeDynamicExpansion) {
    return webToNativeDynamicExpansion[key](value)
  }
}

const all = ['Top', 'Right', 'Bottom', 'Left']
const horiz = ['Right', 'Left']
const vert = ['Top', 'Bottom']

const EXPANSIONS: Record<string, string[]> = {
  borderColor: ['TopColor', 'RightColor', 'BottomColor', 'LeftColor'],
  borderRadius: [
    'TopLeftRadius',
    'TopRightRadius',
    'BottomRightRadius',
    'BottomLeftRadius',
  ],
  borderWidth: ['TopWidth', 'RightWidth', 'BottomWidth', 'LeftWidth'],
  margin: all,
  marginHorizontal: horiz,
  marginVertical: vert,
  padding: all,
  paddingHorizontal: horiz,
  paddingVertical: vert,
}

for (const parent in EXPANSIONS) {
  const prefix = parent.slice(0, /[A-Z]/.exec(parent)?.index ?? parent.length)
  EXPANSIONS[parent] = EXPANSIONS[parent].map((k) => `${prefix}${k}`)
}
