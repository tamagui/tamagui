import type { GenericVariantDefinitions } from '../types'

// deep merge variants
// except for functions which override any parents

export const mergeVariants = (
  parentVariants: GenericVariantDefinitions,
  ourVariants: GenericVariantDefinitions,
  level = 0
) => {
  const variants = {}

  for (const key in ourVariants) {
    const parentVariant = parentVariants?.[key]
    const ourVariant = ourVariants[key]
    if (!parentVariant || typeof ourVariant === 'function') {
      variants[key] = ourVariant
    } else if (parentVariant && !ourVariant) {
      variants[key] = parentVariant[key]
    } else {
      if (level === 0) {
        variants[key] = mergeVariants(
          parentVariant as Record<string, any>,
          ourVariant as Record<string, any>,
          level + 1
        )
      } else {
        variants[key] = {
          ...parentVariant,
          ...ourVariant,
        }
      }
    }
  }

  return {
    ...parentVariants,
    ...variants,
  }
}
