import type { GetStyleState, SplitStyleProps } from '../types'
import { getTokenForKey } from './getTokenForKey'

// includes the optional `/NN` opacity-modifier suffix ($color9/50) so
// getTokenForKey receives it and can apply the alpha — without it the token
// resolves but the bare `/50` is left behind in the parsed gradient string
const tokenPattern = /(\$[\w.-]+(?:\/[\d.]+)?)/g

/**
 * native: resolves embedded legacy $tokens inside compound value strings.
 *
 * This deliberately does NOT parse boxShadow/textShadow/backgroundImage into
 * RN object format anymore: those strings flow WHOLE into the program engine
 * (clause-free strings are base-only programs) and the evaluator parses the
 * winning payload AFTER clause evaluation — parsing here mangled clause text
 * into the last component (review P0-2, third occurrence of the shape).
 *
 * A token resolving to a non-primitive (DynamicColorIOS) stays literal rather
 * than stringifying to "[object Object]": the value then visibly fails to
 * resolve instead of silently corrupting the output.
 */
export function platformResolveValue(
  key: string,
  value: string,
  styleProps: SplitStyleProps,
  styleState: Partial<GetStyleState>
): any {
  // gradients don't support dynamic color updates — RN resolves colors once
  // at render time — so backgroundImage forces plain web-style values and the
  // component re-renders on scheme changes
  const effectiveStyleProps =
    key === 'backgroundImage'
      ? { ...styleProps, resolveValues: 'web' as const }
      : styleProps

  return value.replace(tokenPattern, (token) => {
    let resolved = getTokenForKey('size', token, effectiveStyleProps, styleState)
    if (resolved == null) {
      resolved = getTokenForKey('color', token, effectiveStyleProps, styleState)
    }
    if (resolved == null) return token
    if (typeof resolved !== 'string' && typeof resolved !== 'number') return token
    return String(resolved)
  })
}
