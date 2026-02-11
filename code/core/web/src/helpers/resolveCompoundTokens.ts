import type { GetStyleState, SplitStyleProps } from '../types'
import { platformResolveValue } from './platformResolveValue'

const compoundKeys: Record<string, boolean> = {
  boxShadow: true,
  textShadow: true,
  filter: true,
  backgroundImage: true,
  border: true,
  outline: true,
}

/**
 * resolves embedded $tokens in compound CSS string values like
 * boxShadow, textShadow, filter, backgroundImage, border, outline.
 *
 * returns the original value unchanged if no resolution is needed.
 */
export function resolveCompoundTokens(
  key: string,
  value: string,
  styleProps: SplitStyleProps,
  styleState: Partial<GetStyleState>
): any {
  if (!value.includes('$')) return value
  if (!compoundKeys[key]) return value
  return platformResolveValue(key, value, styleProps, styleState)
}
