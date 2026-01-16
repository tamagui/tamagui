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

// Parse CSS boxShadow string to RN object array (for native RN 0.76+)
const parseBoxShadowStr = (s: string) =>
  s.split(/,(?![^(]*\))/).map((shadow) => {
    const p = shadow.trim().split(/\s+/)
    let i = 0
    const o: any = { offsetX: 0, offsetY: 0 }
    if (p[0] === 'inset') {
      o.inset = true
      i++
    }
    const n = (v: string) => Number.parseFloat(v) || 0
    if (p[i]) o.offsetX = n(p[i++])
    if (p[i]) o.offsetY = n(p[i++])
    if (p[i] && /^-?[\d.]/.test(p[i])) o.blurRadius = n(p[i++])
    if (p[i] && /^-?[\d.]/.test(p[i])) o.spreadDistance = n(p[i++])
    if (p[i]) o.color = p.slice(i).join(' ')
    return o
  })

// Parse CSS filter string to RN object array (for native RN 0.76+)
const parseFilterStr = (s: string): any[] => {
  const result: any[] = []
  // Match filter functions like "brightness(1.2)" or "blur(5px)"
  const regex = /(\w+)\(([^)]+)\)/g
  let match
  while ((match = regex.exec(s)) !== null) {
    const [, fn, val] = match
    const numVal = Number.parseFloat(val) || 0
    switch (fn) {
      case 'brightness':
      case 'opacity':
      case 'contrast':
      case 'grayscale':
      case 'invert':
      case 'saturate':
      case 'sepia':
        result.push({ [fn]: numVal })
        break
      case 'blur':
        result.push({ blur: numVal })
        break
      case 'hueRotate':
      case 'hue-rotate':
        result.push({ hueRotate: val })
        break
      case 'dropShadow':
      case 'drop-shadow': {
        // Parse drop-shadow(offsetX offsetY [blur] [color])
        const parts = val.trim().split(/\s+/)
        const ds: any = {
          offsetX: Number.parseFloat(parts[0]) || 0,
          offsetY: Number.parseFloat(parts[1]) || 0,
        }
        if (parts[2] && /^-?[\d.]/.test(parts[2])) {
          ds.blurRadius = Number.parseFloat(parts[2]) || 0
          if (parts[3]) ds.color = parts.slice(3).join(' ')
        } else if (parts[2]) {
          ds.color = parts.slice(2).join(' ')
        }
        result.push({ dropShadow: ds })
        break
      }
    }
  }
  return result
}

export function expandStyle(key: string, value: any): PropMappedValue {
  if (isAndroid && key === 'elevationAndroid') {
    return [['elevation', value]]
  }

  // Native: convert boxShadow string to object array for RN 0.76+
  if (key === 'boxShadow') {
    if (typeof value === 'string') {
      return [['boxShadow', parseBoxShadowStr(value)]]
    }
    if (value && !Array.isArray(value)) {
      return [['boxShadow', [value]]]
    }
  }

  // Native: convert filter string to object array for RN 0.76+
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
