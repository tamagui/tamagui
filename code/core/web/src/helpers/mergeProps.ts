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
 *   - pseudo props and variants maintain runtime order for proper priority
 *
 * Example of variant/pseudo prop ordering importance:
 *   const StyledButton = styled(Button, {
 *     pressStyle: { bg: '$blue10' },
 *     variants: {
 *       variant: {
 *         default: { pressStyle: { bg: 'red', scale: 1.05 } }
 *       }
 *     }
 *   })
 *
 *   case 1: variant first, then pressStyle
 *   <StyledButton variant='default' pressStyle={{ bg: 'orange' }} />
 *   output: {variant: 'default', pressStyle: {bg: 'orange'}}
 *
 *   case 2: pressStyle first, then variant
 *   <StyledButton pressStyle={{ bg: 'orange' }} variant='default' />
 *   output: {pressStyle: {bg: 'orange'}, variant: 'default'}
 */

import { mediaKeys } from '../hooks/useMedia'
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

  // Targeted reordering: only reorder pseudo props and variants that need runtime order
  if (b && Object.keys(b).length > 0) {
    // Check if we have any pseudo props or variants that need reordering
    const hasPropsNeedingReorder = Object.keys(b).some(
      (key) =>
        (key in pseudoDescriptors || key === 'variant') && a && key in a && key in out
    )

    if (hasPropsNeedingReorder) {
      const reordered: AnyRecord = {}

      // First: Add pseudo props and variants that need specific ordering from runtime props (b)
      for (const key in b) {
        if ((key in pseudoDescriptors || key === 'variant') && key in out) {
          reordered[key] = out[key]
        }
      }

      // Second: Add all other props in their original order
      for (const key in out) {
        if (!(key in reordered)) {
          reordered[key] = out[key]
        }
      }

      return reordered
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
  const longhand = inverseShorthands?.[key] || null
  const val = a[key]

  // This ensures styled definition and runtime props are always merged
  if (key in pseudoDescriptors || mediaKeys.has(key)) {
    out[key] = {
      ...out[key],
      ...val,
    }
    return
  }

  if (b && (key in b || (longhand && longhand in b))) {
    return
  }

  out[longhand || key] = val
}
