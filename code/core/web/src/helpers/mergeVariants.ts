import type { GenericVariantDefinitions } from '../types'
import { styledDynamicSymbol } from '../types'
import { isPlainObject } from './isObj'

function mergeVariantValues(earlier: unknown, later: unknown): unknown {
  if (typeof earlier !== 'string' || typeof later !== 'string') return later
  if (!earlier.includes(':') && !later.includes(':')) return later

  const getSlot = (token: string, colon: number) => {
    const slot: string[] = []
    for (let modifier of token.slice(0, colon).split(':')) {
      if (modifier === 'active') modifier = 'press'
      else if (modifier.startsWith('group-active')) {
        modifier = modifier.replace('group-active', 'group-press')
      }
      let index = 0
      while (index < slot.length && slot[index] < modifier) index++
      if (slot[index] !== modifier) slot.splice(index, 0, modifier)
    }
    return slot.join(':')
  }

  const clauses = new Map<string, string>()
  let base: string | undefined
  const add = (source: string, reject: boolean) => {
    for (const token of source.trim().split(/\s+/)) {
      const colon = token.lastIndexOf(':')
      if (colon === -1) base = token
      else {
        if (colon === token.length - 1) {
          if (reject) return false
          continue
        }
        const slot = getSlot(token, colon)
        clauses.delete(slot)
        clauses.set(slot, token)
      }
    }
    return true
  }
  add(earlier, false)
  if (!add(later, true)) return later
  return [base, ...clauses.values()].filter(Boolean).join(' ')
}

// same key ordering as mergeProps (parent keys first, then ours), but a key
// present on both sides merges its clauses instead of being replaced outright
function mergeStyleBranch(
  parentBranch: Record<string, any>,
  ourBranch: Record<string, any>
) {
  const out: Record<string, any> = { ...parentBranch }
  for (const key in ourBranch) {
    out[key] =
      key in parentBranch
        ? mergeVariantValues(parentBranch[key], ourBranch[key])
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

  const variants: Record<string, any> = { ...parentVariants }

  for (const key in ourVariants) {
    const parentVariant = parentVariants?.[key]
    const ourVariant = ourVariants[key]
    if (
      !isPlainObject(parentVariant) ||
      !isPlainObject(ourVariant) ||
      // styled.dynamic carriers are atomic: a child redefinition replaces the
      // parent's outright, never merges (spreading a bare marker's brand into
      // an enumerated child would turn it into a consumed no-op)
      styledDynamicSymbol in parentVariant ||
      styledDynamicSymbol in ourVariant
    ) {
      variants[key] = ourVariant
    } else {
      if (level === 0) {
        variants[key] = mergeVariants(parentVariant, ourVariant, level + 1)
      } else {
        variants[key] = mergeStyleBranch(parentVariant, ourVariant)
      }
    }
  }

  return variants
}
