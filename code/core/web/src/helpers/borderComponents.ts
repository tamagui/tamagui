// the one classifier for border/outline shorthand components. every parser
// (web composite lowering, native border emission, native normalizeStyle
// expansion) routes through it so they cannot disagree on what counts as a
// width, a line style, or a color

export const lineStyles = new Set([
  'none',
  'hidden',
  'dotted',
  'dashed',
  'solid',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset',
])

// splits on whitespace outside parens and quotes, so `rgb(1, 2, 3)` and
// `calc(1px + 1px)` stay single components
export function splitComponents(value: string): string[] {
  return (
    value.match(
      /(?:[^\s("']+|\((?:[^()]|\([^)]*\))*\)|"(?:\\.|[^"])*"|'(?:\\.|[^'])*')+/g
    ) || []
  )
}

export function startsValueFunction(value: string): boolean {
  return /^-?[a-z][a-z0-9-]*\(/i.test(value)
}

const colorFunction =
  /^(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\(/i

export type BorderComponents = {
  width?: string
  style?: string
  color?: string
}

export function classifyBorderComponents(raw: string, allowAuto = false) {
  const out: BorderComponents = {}
  for (const part of splitComponents(raw)) {
    if (lineStyles.has(part) || (allowAuto && part === 'auto')) {
      out.style = part
    } else if (colorFunction.test(part)) {
      out.color = part
    } else if (
      part === 'thin' ||
      part === 'medium' ||
      part === 'thick' ||
      /^[+-]?(?:\d+\.?\d*|\.\d+)(?:%|[a-z]+)?$/.test(part) ||
      startsValueFunction(part)
    ) {
      out.width = part
    } else {
      out.color = part
    }
  }
  return out
}
