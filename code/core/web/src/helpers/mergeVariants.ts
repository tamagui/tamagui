import type { GenericVariantDefinitions } from '../types'
import { mergeProps } from './mergeProps'

function isPlainObject(value: unknown): value is Record<string, any> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
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
        // A branch is a style object. Merge clause-bearing flat values at the
        // same property granularity as ordinary default props so a child base
        // can override the parent base without erasing parent state clauses.
        variants[key] = mergeProps(parentVariant, ourVariant)
      }
    }
  }

  return {
    ...parentVariants,
    ...variants,
  }
}
