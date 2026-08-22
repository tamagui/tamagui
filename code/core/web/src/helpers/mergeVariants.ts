import { mergeFlatValues } from '@tamagui/style-grammar/runtime'

import type { GenericVariantDefinitions } from '../types'
import { isPlainObject } from './isObj'

// same key ordering as mergeProps (parent keys first, then ours), but a key
// present on both sides merges its clauses instead of being replaced outright
function mergeStyleBranch(
  parentBranch: Record<string, any>,
  ourBranch: Record<string, any>
) {
  const out: Record<string, any> = {}
  for (const key in parentBranch) {
    if (key in ourBranch) continue
    out[key] = parentBranch[key]
  }
  for (const key in ourBranch) {
    out[key] =
      key in parentBranch
        ? process.env.TAMAGUI_RUNTIME_STYLE_VALUE_GRAMMAR === 'disabled'
          ? ourBranch[key]
          : mergeFlatValues(parentBranch[key], ourBranch[key])
        : ourBranch[key]
  }
  return out
}

export const mergeVariants = (
  parentVariants?: GenericVariantDefinitions | Record<string, any>,
  ourVariants?: GenericVariantDefinitions | Record<string, any>,
  level = 0
) => {
  if (!ourVariants) {
    return parentVariants || {}
  }
  if (!parentVariants) {
    return ourVariants || {}
  }

  const variants: Record<string, any> = {}

  for (const key in ourVariants) {
    const parentVariant = parentVariants?.[key]
    const ourVariant = ourVariants[key]
    if (!isPlainObject(parentVariant) || !isPlainObject(ourVariant)) {
      variants[key] = ourVariant
    } else {
      if (level === 0) {
        variants[key] = mergeVariants(parentVariant, ourVariant, level + 1)
      } else {
        // A branch is a style object. Merge per property, and per clause within
        // a property: a child restating `borderColor="green"` overrides the
        // parent's base without erasing the parent's `press:transparent`, which
        // a plain key-level override silently dropped.
        variants[key] = mergeStyleBranch(parentVariant, ourVariant)
      }
    }
  }

  return {
    ...parentVariants,
    ...variants,
  }
}
