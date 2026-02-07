import type { PropMappedValue } from '../types'

// outline style keywords
const outlineStyles = new Set([
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

  const parts = value.trim().split(/\s+/)
  let outlineWidth: string | number | undefined
  let outlineStyle: string | undefined
  let outlineColor: string | undefined

  for (const part of parts) {
    // check if it's an outline style keyword
    if (outlineStyles.has(part)) {
      outlineStyle = part
    }
    // check if it's a length (number or ends with px/em/rem/etc)
    else if (/^[\d.]+(?:px|em|rem|%|pt|vw|vh)?$/.test(part)) {
      const num = parseFloat(part)
      outlineWidth = part.endsWith('px') || !part.match(/[a-z%]/i) ? num : part
    }
    // otherwise assume it's a color
    else {
      outlineColor = part
    }
  }

  const result: PropMappedValue = []

  if (outlineWidth !== undefined) {
    result.push(['outlineWidth', outlineWidth])
  }
  if (outlineStyle !== undefined) {
    result.push(['outlineStyle', outlineStyle])
  }
  if (outlineColor !== undefined) {
    result.push(['outlineColor', outlineColor])
  }

  return result.length > 0 ? result : undefined
}
