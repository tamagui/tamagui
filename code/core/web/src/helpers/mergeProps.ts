/**
 * Preserves prop ordering, so that the order most closely matches the last spread objects
 * Useful for having { ...defaultProps, ...props } that ensure props ordering is always kept
 *
 * Merges sub-objects if they match tamagui pseudo descriptors or media keys
 *
 *    Given:
 *      mergeProps({ a: 1, b: 2 }, { b: 1, a: 2 })
 *    The final key order will be:
 *      b, a
 *
 */

import { mediaKeys } from '../hooks/useMedia'
import { pseudoDescriptors } from './pseudoDescriptors'

export type GenericProps = Record<string, any>

export const mergeProps = (a: Object, b?: Object) => {
  const out: GenericProps = {}

  // ⚠️ keep in sync with mergeComponentProps logic
  for (const key in a) {
    mergeProp(out, a, b, key)
  }
  if (b) {
    for (const key in b) {
      mergeProp(out, b, undefined, key)
    }
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
  // this is the same logic as mergeProps but tracking overrides!

  for (const key in defaultProps) {
    mergeProp(out, defaultProps, props, key)
  }

  if (props) {
    for (const key in props) {
      if (mergeProp(out, props, undefined, key)) {
        if (contextProps && key in contextProps) {
          overriddenContext ||= {}
          overriddenContext[key] = props[key]
        }
      }
    }
  }

  for (const key in contextProps) {
    if (!(key in props)) {
      mergeProp(out, contextProps, props, key)
    }
  }

  return [out, overriddenContext] as const
}

function mergeProp(out: GenericProps, a: Object, b: Object | undefined, key: string) {
  const val = a[key]

  // This ensures styled definition and runtime props are always merged
  if (key in pseudoDescriptors || mediaKeys.has(key)) {
    out[key] = {
      ...out[key],
      ...val,
    }
    return true
  }

  if (b && key in b) {
    return false
  }

  out[key] = val
  return true
}
