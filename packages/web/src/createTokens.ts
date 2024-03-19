import type { Variable } from './createVariable'
import { createVariables } from './createVariables'
import type { CreateTokens } from './types'

// tokens.color.dark.red ===> { var: `color-dark-red`, val: '' }
export function createTokens<T extends CreateTokens>(tokens: T): MakeTokens<T> {
  return createVariables(tokens) as any
}

type NormalizeTokens<A, Type = A[keyof A]> = {
  // removes $ prefix allowing for defining either as $1: or 1:,
  // which is important because Chrome re-orders numerical-seeming keys :/
  [Key in keyof A extends `$${infer X}` ? X : keyof A]: Variable<Type>
}

// verbose but gives us nice types...
// removes $ prefix allowing for defining either as $1: or 1:,
// which is important because Chrome re-orders numerical-seeming keys :/
type MakeTokens<T extends CreateTokens> = T extends {
  color?: infer E
  space?: infer F
  size?: infer G
  radius?: infer H
  zIndex?: infer J
}
  ? {
      color: NormalizeTokens<E, string>
      space: NormalizeTokens<F, number>
      size: NormalizeTokens<G, number>
      radius: NormalizeTokens<H, number>
      zIndex: NormalizeTokens<J, number>
    } & Omit<
      {
        [key in keyof T]: NormalizeTokens<T[key]>
      },
      'color' | 'space' | 'size' | 'radius' | 'zIndex'
    >
  : never

// // test
// // TODO move to tests
// const tokens = createTokens({
//   size: { 0: 1 },
//   space: { 0: 1 },
//   radius: { 0: 1 },
//   zIndex: { 0: 1 },
//   color: { 0: 'hi' },
//   arbitrary: { abc: '123' },
// })

// tokens.arbitrary.abc
// tokens.size['0']
