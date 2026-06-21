import type { GetStyleState, SplitStyleProps } from '../types'
import { getTokenForKey } from './getTokenForKey'

// includes the optional `/NN` opacity-modifier suffix ($color9/50) so
// getTokenForKey receives it and can apply the alpha — without it the token
// resolves but the bare `/50` is left behind in the CSS string, which makes
// the whole declaration invalid
const tokenPattern = /(\$[\w.-]+(?:\/[\d.]+)?)/g

/**
 * web: resolves embedded $tokens in compound CSS strings via simple regex replacement.
 */
export function platformResolveValue(
  _key: string,
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
