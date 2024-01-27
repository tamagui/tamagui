import type { CreateShorthands } from './types'

// just a type helper util

export function createShorthands<A extends CreateShorthands>(shorthands: A): A {
  return Object.freeze(shorthands) as any
}
