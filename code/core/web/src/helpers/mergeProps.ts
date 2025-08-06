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
 *
 * When defaultVariants are present, all runtime props that override defaults
 * need to maintain their runtime order.
 */

import { mediaKeys } from '../hooks/useMedia'
import { pseudoDescriptors } from './pseudoDescriptors'

type AnyRecord = Record<string, any>

export const mergeProps = (
  a: Object,
  b?: Object,
  inverseShorthands?: AnyRecord,
  variants?: AnyRecord
) => {
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
    // We need to check for:
    // 1. Pseudo props or 'variant' that override defaults (exist in both a and b)
    // 2. If we have variants defined and any variant prop is being overridden
    const hasPropsNeedingReorder = Object.keys(b).some((key) => {
      // Always reorder if it's a pseudo prop or 'variant' being overridden
      if ((key in pseudoDescriptors || key === 'variant') && key in a && key in out) {
        return true
      }
      // If we have variant definitions and this runtime prop is overriding a default,
      // we may need to reorder other variant props too
      if (variants && key in variants && key in a && key in out) {
        return true
      }
      return false
    })

    if (hasPropsNeedingReorder) {
      const reordered: AnyRecord = {}

      // First: Add all non-variant/non-pseudo props (base styles should come first)
      for (const key in out) {
        if (
          !(key in pseudoDescriptors) &&
          key !== 'variant' &&
          !(variants && key in variants)
        ) {
          reordered[key] = out[key]
        }
      }

      // Second: Add pseudo props and variant props from runtime props (b) in their runtime order
      // This ensures variant props override base styles
      for (const key in b) {
        if (
          (key in pseudoDescriptors ||
            key === 'variant' ||
            (variants && key in variants)) &&
          key in out
        ) {
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
