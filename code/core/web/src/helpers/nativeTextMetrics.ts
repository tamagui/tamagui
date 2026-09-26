import { isVariable } from '../createVariable'
import { resolveVariableValue } from './resolveVariableValue'

export type NativeTextMetrics = {
  fontSize?: number
  inheritsFontSize?: boolean
  // numbers retain a ratio; lengths retain their unit until host finalization.
  lineHeight?: number | `${number}px` | 'normal'
}

export type AnimatedTextChannel = {
  fontSize: unknown
  driver: string
}

export type NativeTextContext = {
  parentFontSize?: number
  parentLineHeight?: NativeTextMetrics['lineHeight']
  animatedText?: AnimatedTextChannel | null
}

// called after the winning font size and line height are known, on both native frontends.
export function resolveTextMetrics(
  style: Record<string, unknown>,
  lineHeight: unknown,
  parent?: NativeTextContext,
  isStatic = false,
  apply = true
): NativeTextMetrics {
  if (isVariable(lineHeight))
    lineHeight = resolveVariableValue('lineHeight', lineHeight, 'value')
  let fontSize =
    typeof style.fontSize === 'number' ? style.fontSize : parent?.parentFontSize
  const inheritsFontSize = style.fontSize == null && !!parent?.animatedText
  if (apply && style.fontSize == null && fontSize !== undefined && !inheritsFontSize)
    style.fontSize = fontSize
  let leading: NativeTextMetrics['lineHeight']
  if (lineHeight == null || lineHeight === 'inherit' || lineHeight === 'unset') {
    leading = parent?.parentLineHeight
  } else if (lineHeight === 'normal' || lineHeight === 'initial') {
    leading = 'normal'
  } else if (typeof lineHeight === 'number') {
    leading = lineHeight
  } else if (typeof lineHeight === 'string') {
    if (/^(?:\d+\.?\d*|\.\d+)px$/.test(lineHeight)) {
      leading = lineHeight as `${number}px`
    } else if (lineHeight.trim() !== '' && Number.isFinite(+lineHeight)) {
      leading = +lineHeight
    }
  }

  if (typeof leading === 'number' && (!Number.isFinite(leading) || leading < 0)) {
    delete style.lineHeight
    return { fontSize, ...(inheritsFontSize && { inheritsFontSize }) }
  }

  if (!apply)
    return {
      fontSize,
      lineHeight: leading,
      ...(inheritsFontSize && { inheritsFontSize }),
    }

  if (typeof leading === 'number') {
    if (fontSize === undefined && !isStatic && !inheritsFontSize) {
      fontSize = 14
      style.fontSize = fontSize
    }
    if (inheritsFontSize || fontSize === undefined) delete style.lineHeight
    else style.lineHeight = fontSize * leading
  } else if (leading && leading !== 'normal') {
    style.lineHeight = Number.parseFloat(leading)
  } else if (lineHeight != null || leading === 'normal') {
    delete style.lineHeight
  }
  return { fontSize, lineHeight: leading, ...(inheritsFontSize && { inheritsFontSize }) }
}
