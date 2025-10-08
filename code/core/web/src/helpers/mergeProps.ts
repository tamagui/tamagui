/**
 * Preserves prop ordering, so that the order most closely matches the last spread objects
 * Useful for having { ...defaultProps, ...props } that ensure props ordering is always kept
 *
 * Honestly this is somehwat backwards logically from Object.assign, reason was that we typically
 * are merging defaultProps, givenProps, but we started using it elsewhere and now its a bit confusing
 * Should look into refactoring this to match common usage
 *
 * Merges sub-objects if they start are pseudo-keys or media-key-like (start with "$")
 *
 *    Given:
 *      mergeProps({ a: 1, b: 2 }, { b: 1, a: 2 })
 *    The final key order will be:
 *      b, a
 *
 */

import { pseudoDescriptors } from './pseudoDescriptors'

export type GenericProps = Record<string, any>

export const mergeProps = (defaultProps: Object, props: Object) => {
  const out: GenericProps = {}

  // in general objects keys are sorted by order of insertion
  // we merge "defaultProps" first as they should come first
  // (so Object.keys(finalProps) will list [...defaultPropKeys] first)
  // but we ignore any keys from props, and merge it after, that way
  // final order is [...defaultPropKeys, ...propKeys]

  // ⚠️ keep in sync with mergeComponentProps logic

  for (const key in defaultProps) {
    if (key in props) continue
    out[key] = defaultProps[key]
  }

  for (const key in props) {
    mergeProp(out, defaultProps, props, key)
  }

  return out
}

// merge props but also handles defaultProps + styledContext
export const mergeComponentProps = (
  // this is "a" in mergeProps
  defaultProps: Object | null | undefined,
  contextProps: Object | undefined,
  // this is "b" in mergeProps
  props: Object
) => {
  let overriddenContext: GenericProps | null = null

  if (!defaultProps && !contextProps) {
    return [props, overriddenContext] as const
  }

  if (defaultProps && !contextProps) {
    return [mergeProps(defaultProps, props), overriddenContext] as const
  }

  // the only unique case is contextProps, we need to track overrides and do something a bit tricky
  // since we respect prop order for styles, we want to preserve the object key order in overriddenContext

  const out: GenericProps = {}

  // ⚠️ keep in sync with mergeProps logic
  // same logic as mergeProps but tracking overrides!

  for (const key in defaultProps) {
    if (key in props) continue
    out[key] = defaultProps[key]
  }

  // styled context props go after defaultProps but before props
  for (const key in contextProps) {
    if (key in props) continue
    const contextValue = contextProps[key]
    // don't merge undefined context values to preserve inheritance
    if (contextValue !== undefined) {
      out[key] = contextValue
    }
  }

  for (const key in props) {
    mergeProp(out, defaultProps, props, key)
    if (contextProps && key in contextProps) {
      overriddenContext ||= {}
      overriddenContext[key] = props[key]
    }
  }

  return [out, overriddenContext] as const
}

function mergeProp(
  out: Object,
  defaultProps: Object | undefined | null,
  props: Object,
  key: string
) {
  let val = props[key]

  // one special case - we merge tamagui style sub-objects
  if (
    defaultProps &&
    key in defaultProps &&
    (key in pseudoDescriptors || key[0] === '$') &&
    val &&
    typeof val === 'object'
  ) {
    const defaultVal = defaultProps[key]
    if (defaultVal && typeof defaultVal === 'object') {
      // use merge props so we prefer the key ordering the the last merged
      val = mergeProps(defaultVal, val)
    }
  }

  out[key] = val
}
