import { GenericShorthands } from './types'

// type helper

export function createShorthands<A extends Record<string, string>>(shorthands: A): A {
  return Object.freeze(shorthands) as any
}
