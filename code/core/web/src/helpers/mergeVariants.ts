import type { GenericVariantDefinitions } from '../types'
import { isPlainObject } from './isObj'

function mergeVariantValues(earlier: unknown, later: unknown): unknown {
  if (typeof earlier !== 'string' || typeof later !== 'string') return later
  if (!earlier.includes(':') && !later.includes(':')) return later

  const getSlot = (chain: string) => {
    return chain
      .split(':')
      .map((m) => {
        if (m === 'active') return 'press'
        if (m.startsWith('group-active')) return m.replace('group-active', 'group-press')
        return m
      })
      .sort()
      .filter((m, i, arr) => i === 0 || m !== arr[i - 1])
      .join(':')
  }

  const parseTokens = (str: string) => {
    const tokens = str.trim().split(/\s+/).filter(Boolean)
    let base: string | null = null
    const clauses: { slot: string; full: string }[] = []
    let malformed = false
    for (const token of tokens) {
      const lastColon = token.lastIndexOf(':')
      if (lastColon === -1) {
        base = token
      } else {
        const payload = token.slice(lastColon + 1)
        if (!payload) {
          malformed = true
          continue
        }
        const chain = token.slice(0, lastColon)
        clauses.push({ slot: getSlot(chain), full: token })
      }
    }
    return { base, clauses, malformed }
  }

  const l = parseTokens(later)
  if (l.malformed) return later

  const e = parseTokens(earlier)

  const parts: string[] = []
  const base = l.base !== null ? l.base : e.base
  if (base !== null) parts.push(base)

  const laterSlots = new Set(l.clauses.map((c) => c.slot))
  for (const c of e.clauses) {
    if (!laterSlots.has(c.slot)) {
      parts.push(c.full)
    }
  }
  for (const c of l.clauses) {
    parts.push(c.full)
  }

  return parts.join(' ')
}

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
        variants[key] = mergeStyleBranch(parentVariant, ourVariant)
      }
    }
  }

  return {
    ...parentVariants,
    ...variants,
  }
}
