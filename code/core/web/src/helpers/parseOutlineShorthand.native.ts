import type { PropMappedValue } from '../types'
import { classifyBorderComponents } from './borderComponents'
import { toNativeBorderWidth } from './parseBorderShorthand.native'

// parses CSS outline shorthand: "<width> <style> <color>"
// components can appear in any order, all are optional
// on native, expands directly to individual outline properties
export function parseOutlineShorthand(value: string): PropMappedValue | undefined {
  if (value === 'none' || value === '0') {
    return [
      ['outlineWidth', 0],
      ['outlineStyle', 'none'],
    ]
  }

  const { width, style, color } = classifyBorderComponents(value, true)

  const result: PropMappedValue = []

  if (width !== undefined) {
    result.push(['outlineWidth', toNativeBorderWidth(width)])
  }
  if (style !== undefined) {
    result.push(['outlineStyle', style])
  }
  if (color !== undefined) {
    result.push(['outlineColor', color])
  }

  return result.length > 0 ? result : undefined
}
