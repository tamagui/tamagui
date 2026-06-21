import type { GetStyleState, SplitStyleProps } from '../types'
import { getTokenForKey } from './getTokenForKey'
import { parseNativeStyle } from './parseNativeStyle'

// includes the optional `/NN` opacity-modifier suffix ($color9/50) so
// getTokenForKey receives it and can apply the alpha — without it the token
// resolves but the bare `/50` is left behind in the parsed gradient string
const tokenPattern = /(\$[\w.-]+(?:\/[\d.]+)?)/g

// keys that need native object parsing (DynamicColorIOS support)
const nativeParseKeys: Record<string, boolean> = {
  backgroundImage: true,
  boxShadow: true,
  textShadow: true,
}

function replaceTokens(
  value: string,
  styleProps: SplitStyleProps,
  styleState: Partial<GetStyleState>
): string {
  return value.replace(tokenPattern, (t) => {
    let r = getTokenForKey('size', t, styleProps, styleState)
    if (r == null) {
      r = getTokenForKey('color', t, styleProps, styleState)
    }
    return r != null ? String(r) : t
  })
}

/**
 * native: resolves embedded $tokens, with DynamicColorIOS placeholder
 * support for boxShadow/textShadow/backgroundImage.
 */
export function platformResolveValue(
  key: string,
  value: string,
  styleProps: SplitStyleProps,
  styleState: Partial<GetStyleState>
): any {
  if (!nativeParseKeys[key]) {
    return replaceTokens(value, styleProps, styleState)
  }

  // for backgroundImage (gradients), force 'web' resolution to avoid DynamicColorIOS
  // gradients don't support dynamic color updates - RN resolves colors once at render time
  // so we need plain values and must let the component re-render on scheme changes
  const effectiveStyleProps =
    key === 'backgroundImage'
      ? { ...styleProps, resolveValues: 'web' as const }
      : styleProps

  // preserve DynamicColorIOS objects through parsing (for boxShadow/textShadow)
  const tokenMap = new Map<string, any>()
  let placeholderIdx = 0
  const withPlaceholders = value.replace(tokenPattern, (t) => {
    let r = getTokenForKey('size', t, effectiveStyleProps, styleState)
    if (r == null) {
      r = getTokenForKey('color', t, effectiveStyleProps, styleState)
    }
    if (r == null) return t
    if (typeof r !== 'string' && typeof r !== 'number') {
      const placeholder = `__tk${placeholderIdx++}__`
      tokenMap.set(placeholder, r)
      return placeholder
    }
    return String(r)
  })

  const parsed = parseNativeStyle(key, withPlaceholders, tokenMap)
  if (parsed) return parsed

  // fallback to plain string resolution
  return replaceTokens(value, styleProps, styleState)
}
