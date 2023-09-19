import type { GenericVariantDefinitions } from '../types'

// deep merge variants
// except for functions which override any parents

export const mergeVariants = (
  parentVariants: GenericVariantDefinitions,
  ourVariants: GenericVariantDefinitions
) => {
  const variants = {}

  for (const key in ourVariants) {
    const parentVariant = parentVariants?.[key]
    const ourVariant = ourVariants[key]

    // do some early checks to avoid bad merges
    if (!parentVariant || typeof ourVariant === 'function') {
      variants[key] = ourVariant
      continue
    }

    // do some early checks to avoid bad merges
    if (parentVariant && !ourVariant) {
      variants[key] = parentVariant[key]
      continue
    }

    variants[key] = {}

    for (const subKey in ourVariant) {
      const val = ourVariant[subKey]
      const parentVal = parentVariant?.[subKey]
      if (typeof val === 'function') {
        variants[key][subKey] = val
      } else if (!parentVal || typeof parentVal === 'function') {
        variants[key][subKey] = val
      } else {
        variants[key][subKey] = {
          // keep order
          ...parentVal,
          ...val,
        }
      }
    }

    // merge parent variant keys that are superset
    if (parentVariant) {
      variants[key] = {
        ...parentVariant,
        ...variants[key],
      }
    }
  }

  return {
    ...parentVariants,
    ...variants,
  }
}
