/**
 * Preserves prop ordering, so that the order most closely matches the last spread objects
 * Useful for having { ...defaultProps, ...props } that ensure props ordering is always kept
 *
 *    Given:
 *      mergeProps({ a: 1, b: 2 }, { b: 1, a: 2 })
 *    The final key order will be:
 *      b, a
 *
 * Handles a couple special tamagui cases
 *   - classNames can be extracted out separately
 *   - shorthands can be expanded before merging
 */

import { pseudoDescriptors } from './pseudoDescriptors'

type AnyRecord = Record<string, any>

export const mergeProps = (a: Object, b?: Object, inverseShorthands?: AnyRecord) => {
  const out: AnyRecord = {}
  for (const key in a) {
    mergeProp(out, a, b, key, inverseShorthands)
  }
  if (b) {
    for (const key in b) {
      mergeProp(out, b, undefined, key, inverseShorthands)
    }
  }
  return out
}

function mergeProp(
  out: AnyRecord,
  a: Object,
  b: Object | undefined,
  key: string,
  inverseShorthands?: AnyRecord
) {
  const shorthand = inverseShorthands?.[key] || null
  if (b && (key in b || (shorthand && shorthand in b))) {
    return
  }
  const val = a[key]
  if (key in pseudoDescriptors) {
    out[key] = {
      ...out[key],
      ...val,
    }
    return
  }
  out[shorthand || key] = val
}
