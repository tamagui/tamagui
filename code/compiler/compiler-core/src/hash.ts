import { createHash } from 'node:crypto'

/** The one content hash every compiler cache identity is built from. */
export function contentHash(value: string | Uint8Array): string {
  return createHash('sha256').update(value).digest('hex')
}

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0
}

function stringify(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return `[${value.map((child) => stringify(child) ?? 'null').join(',')}]`
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => compareCodeUnits(left, right))
      .map(([key, child]) => [key, stringify(child)] as const)
      .filter((entry): entry is readonly [string, string] => entry[1] !== undefined)
    return `{${entries
      .map(([key, child]) => `${JSON.stringify(key)}:${child}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}

/**
 * Key-order-independent JSON. Cache identities are hashed from this, so two
 * objects that differ only in property order must serialize identically.
 */
export function stableStringify(value: unknown): string {
  const serialized = stringify(value)
  if (serialized === undefined) throw new Error('Cannot serialize undefined cache root')
  return serialized
}
