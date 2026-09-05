import { Dimensions, PixelRatio } from 'react-native'

export interface UnitContext {
  windowWidth: number
  windowHeight: number
  fontScale: number
  remBaseFontSize: number
  containerWidth: number
  containerHeight: number
  elementFontSize: number
  isFontSizeProp: boolean
}

const UNIT_RE = /^([+-]?\s*\d*\.?\d+)(px|rem|em|vw|vh|vmin|vmax|cqi|cqw|cqh|cqb)?$/i

export function isDynamicUnitValue(value: unknown): boolean {
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  if (trimmed.startsWith('clamp(') || trimmed.startsWith('CLAMP(')) return true
  // a unit suffix only counts when a number precedes it. matching the suffix
  // alone turns every word ending in one into a length: 'System' ends in `em`
  // and resolved to 0, wiping out fontFamily
  return !!UNIT_RE.exec(trimmed.replace(/\s+/g, ''))?.[2]
}

function getUnitContext(key: string, styleState?: any): UnitContext {
  const window = Dimensions.get('window')
  const fontScale =
    typeof PixelRatio !== 'undefined' && PixelRatio.getFontScale
      ? PixelRatio.getFontScale()
      : 1
  const remBaseFontSize = styleState?.conf?.settings?.remBaseFontSize ?? 16
  const isFontSizeProp = key === 'fontSize'
  const elementFontSize =
    typeof styleState?.style?.fontSize === 'number'
      ? styleState.style.fontSize
      : remBaseFontSize

  // Look up container layout from group context or component state
  const groupContext = styleState?.flatGroupContext
  const groupEntry = groupContext?.['@']
  const groupLayout =
    groupEntry?.state?.layout || styleState?.componentState?.group?.['@']?.layout

  let containerWidth = groupLayout?.width
  let containerHeight = groupLayout?.height

  // First-frame seed if unmeasured
  if (containerWidth === undefined || containerWidth === 0) {
    const maxWidth =
      typeof styleState?.style?.maxWidth === 'number'
        ? styleState.style.maxWidth
        : undefined
    containerWidth = Math.min(window.width, maxWidth ?? Infinity)
  }

  if (containerHeight === undefined || containerHeight === 0) {
    containerHeight = window.height
  }

  return {
    windowWidth: window.width,
    windowHeight: window.height,
    fontScale,
    remBaseFontSize,
    containerWidth,
    containerHeight,
    elementFontSize,
    isFontSizeProp,
  }
}

export function resolveSingleUnit(val: string, ctx: UnitContext): number {
  const trimmed = val.replace(/\s+/g, '')
  const match = UNIT_RE.exec(trimmed)
  if (!match) return Number(trimmed) || 0

  const num = Number.parseFloat(match[1])
  if (Number.isNaN(num)) return 0

  const unit = (match[2] || 'px').toLowerCase()

  switch (unit) {
    case 'px':
      return num
    case 'rem':
      // Accessibility: layout props scale with OS fontScale; fontSize leaves scaling to RN Text
      return num * ctx.remBaseFontSize * (ctx.isFontSizeProp ? 1 : ctx.fontScale)
    case 'em':
      return num * ctx.elementFontSize
    case 'vw':
      return (num / 100) * ctx.windowWidth
    case 'vh':
      return (num / 100) * ctx.windowHeight
    case 'vmin':
      return (num / 100) * Math.min(ctx.windowWidth, ctx.windowHeight)
    case 'vmax':
      return (num / 100) * Math.max(ctx.windowWidth, ctx.windowHeight)
    case 'cqi':
    case 'cqw':
      return (num / 100) * ctx.containerWidth
    case 'cqh':
    case 'cqb':
      return (num / 100) * ctx.containerHeight
    default:
      return num
  }
}

export function resolveClamp(val: string, ctx: UnitContext): number {
  // Extract content between first '(' and last ')'
  const start = val.indexOf('(')
  const end = val.lastIndexOf(')')
  if (start === -1 || end === -1 || end <= start) return 0

  let inner = val.slice(start + 1, end).trim()
  const args = splitClampArgs(inner)
  if (args.length < 3) return 0

  const min = resolveSingleUnit(args[0], ctx)
  const max = resolveSingleUnit(args[2], ctx)

  // Preferred expression: strip optional calc() wrapper
  let prefStr = args[1].trim()
  if (prefStr.toLowerCase().startsWith('calc(') && prefStr.endsWith(')')) {
    prefStr = prefStr.slice(5, -1).trim()
  }

  // Split into signed terms (e.g. "2.18cqi + 9.82px" or "2cqi - 5px")
  // TODO: this regex only handles addition/subtraction terms. Multiplication (*)
  // and division (/) in raw user calc() expressions are not supported yet.
  let pref = 0
  const terms = prefStr.match(/([+-]?\s*[^+-]+)/g)
  if (terms && terms.length > 0) {
    for (const term of terms) {
      pref += resolveSingleUnit(term, ctx)
    }
  } else {
    pref = resolveSingleUnit(prefStr, ctx)
  }

  const lower = Math.min(min, max)
  const upper = Math.max(min, max)
  return Math.min(Math.max(pref, lower), upper)
}

function splitClampArgs(inner: string): string[] {
  const parts: string[] = []
  let depth = 0
  let current = ''

  for (let i = 0; i < inner.length; i++) {
    const char = inner[i]
    if (char === '(') depth++
    else if (char === ')') depth--

    if (char === ',' && depth === 0) {
      parts.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  if (current.trim()) {
    parts.push(current.trim())
  }

  return parts
}

export function resolveNativeUnits(key: string, value: any, styleState?: any): any {
  if (typeof value !== 'string') return value

  const trimmed = value.trim()
  if (!isDynamicUnitValue(trimmed)) {
    return value
  }

  const ctx = getUnitContext(key, styleState)

  if (trimmed.startsWith('clamp(') || trimmed.startsWith('CLAMP(')) {
    return resolveClamp(trimmed, ctx)
  }

  return resolveSingleUnit(trimmed, ctx)
}
