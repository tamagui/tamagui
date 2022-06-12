/**
 * Preserves prop ordering, so that the order most closely matches the last spread objects
 * Useful for having { ...defaultProps, ...props } that ensure props ordering is always kept
 *
 *    Given:
 *      mergeProps({ a: 1, b: 2 }, { b: 1, a: 2 })
 *    The final key order will be:
 *      b, a
 */

export const mergeProps = (a: Object, b: Object) => {
  const out = {}

  for (const key in a) {
    if (!(key in b)) {
      out[key] = a[key]
    }
  }

  for (const key in b) {
    out[key] = b[key]
  }

  return out
}
