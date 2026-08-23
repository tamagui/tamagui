/**
 * Preserves prop ordering, so that the order most closely matches the last spread objects
 * Useful for having { ...defaultProps, ...props } that ensure props ordering is always kept
 *
 * Honestly this is somehwat backwards logically from Object.assign, reason was that we typically
 * are merging defaultProps, givenProps, but we started using it elsewhere and now its a bit confusing
 * Should look into refactoring this to match common usage
 *
 *    Given:
 *      mergeProps({ a: 1, b: 2 }, { b: 1, a: 2 })
 *    The final key order will be:
 *      b, a
 *
 */

export type GenericProps = Record<string, any>

export const mergeProps = (defaultProps: object, props: object) => {
  const out: GenericProps = {}

  // in general objects keys are sorted by order of insertion
  // we merge "defaultProps" first as they should come first
  // (so Object.keys(finalProps) will list [...defaultPropKeys] first)
  // but we ignore any keys from props, and merge it after, that way
  // final order is [...defaultPropKeys, ...propKeys]

  // ⚠️ keep in sync with readMergedProp / contributeMergedSources order

  for (const key in defaultProps) {
    if (key in props) continue
    out[key] = defaultProps[key]
  }

  for (const key in props) {
    out[key] = props[key]
  }

  return out
}

// resolve one merged prop value without materializing the merged object:
// caller wins, then styled context (undefined context values are skipped so
// they don't mask defaults), then defaults. mirrors the three-source traversal
// in getSplitStyles' contributeMergedSources.
export function readMergedProp(
  caller: Record<string, any>,
  context: Record<string, any> | undefined,
  defaults: Record<string, any> | undefined,
  key: string
): any {
  if (key in caller) return caller[key]
  if (context) {
    const value = context[key]
    if (value !== undefined) return value
  }
  return defaults ? defaults[key] : undefined
}

// caller keys that shadow a styled-context key must still reach children through
// the context-override provider. returns the override map, or null when none.
export function getOverriddenContextProps(
  caller: Record<string, any>,
  context: Record<string, any> | undefined
): GenericProps | null {
  if (!context) return null
  let overrides: GenericProps | null = null
  for (const key in caller) {
    if (key in context) {
      overrides ||= {}
      overrides[key] = caller[key]
    }
  }
  return overrides
}
