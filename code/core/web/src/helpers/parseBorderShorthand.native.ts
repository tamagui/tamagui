import type { PropMappedValue } from '../types'

// border style keywords
const borderStyles = new Set([
  'solid',
  'dashed',
  'dotted',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset',
  'none',
  'hidden',
])

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

  const parts = value.trim().split(/\s+/)
  let borderWidth: string | number | undefined
  let borderStyle: string | undefined
  let borderColor: string | undefined

  for (const part of parts) {
    // check if it's a border style keyword
    if (borderStyles.has(part)) {
      borderStyle = part
    }
    // check if it's a length (number or ends with px/em/rem/etc)
    else if (/^[\d.]+(?:px|em|rem|%|pt|vw|vh)?$/.test(part)) {
      const num = parseFloat(part)
      borderWidth = part.endsWith('px') || !part.match(/[a-z%]/i) ? num : part
    }
    // otherwise assume it's a color
    else {
      borderColor = part
    }
  }

  const result: PropMappedValue = []

  // expand to individual width props (RN doesn't support borderWidth shorthand)
  if (borderWidth !== undefined) {
    result.push(['borderTopWidth', borderWidth])
    result.push(['borderRightWidth', borderWidth])
    result.push(['borderBottomWidth', borderWidth])
    result.push(['borderLeftWidth', borderWidth])
  }
  // borderStyle is supported as-is on native
  if (borderStyle !== undefined) {
    result.push(['borderStyle', borderStyle])
  }
  // expand to individual color props (RN doesn't support borderColor shorthand)
  if (borderColor !== undefined) {
    result.push(['borderTopColor', borderColor])
    result.push(['borderRightColor', borderColor])
    result.push(['borderBottomColor', borderColor])
    result.push(['borderLeftColor', borderColor])
  }

  return result.length > 0 ? result : undefined
}
