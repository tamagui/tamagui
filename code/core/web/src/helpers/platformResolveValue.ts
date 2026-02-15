import type { GetStyleState, SplitStyleProps } from '../types'
import { getTokenForKey } from './getTokenForKey'

const tokenPattern = /(\$[\w.-]+)/g

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
