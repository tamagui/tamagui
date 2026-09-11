import type { PropMappedValue } from '../types'
import { classifyBorderComponents } from './borderComponents'

// native width props want numbers: px and unitless become numbers, the CSS
// width keywords map to their user-agent px values, anything else passes as-is
export function toNativeBorderWidth(width: string): string | number {
  if (width === 'thin') return 1
  if (width === 'medium') return 3
  if (width === 'thick') return 5
  return width.endsWith('px') || !/[a-z%]/i.test(width) ? Number.parseFloat(width) : width
}

// parses CSS border shorthand: "<width> <style> <color>"
// components can appear in any order, all are optional
// on native, expands directly to individual border properties
export function parseBorderShorthand(value: string): PropMappedValue | undefined {
  if (value === 'none' || value === '0') {
    return [
      ['borderTopWidth', 0],
      ['borderRightWidth', 0],
      ['borderBottomWidth', 0],
      ['borderLeftWidth', 0],
      ['borderStyle', 'solid'],
    ]
  }

  const { width, style, color } = classifyBorderComponents(value)

  const result: PropMappedValue = []

  // expand to individual width props (RN doesn't support borderWidth shorthand)
  if (width !== undefined) {
    const nativeWidth = toNativeBorderWidth(width)
    result.push(['borderTopWidth', nativeWidth])
    result.push(['borderRightWidth', nativeWidth])
    result.push(['borderBottomWidth', nativeWidth])
    result.push(['borderLeftWidth', nativeWidth])
  }
  // borderStyle is supported as-is on native
  if (style !== undefined) {
    result.push(['borderStyle', style])
  }
  // expand to individual color props (RN doesn't support borderColor shorthand)
  if (color !== undefined) {
    result.push(['borderTopColor', color])
    result.push(['borderRightColor', color])
    result.push(['borderBottomColor', color])
    result.push(['borderLeftColor', color])
  }

  return result.length > 0 ? result : undefined
}
