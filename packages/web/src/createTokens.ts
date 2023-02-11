import { Variable } from './createVariable'
import { createVariables } from './createVariables'
import { CreateTokens } from './types'

// tokens.color.dark.red ===> { var: `color-dark-red`, val: '' }
export function createTokens<T extends CreateTokens>(tokens: T): MakeTokens<T> {
  return createVariables(tokens) as any
}

// verbose but gives us nice types...
type MakeTokens<T> = T extends {
  color: infer E
  space: infer F
  size: infer G
  radius: infer H
  zIndex: infer J
}
  ? {
      color: {
        // removes $ prefix allowing for defining either as $1: or 1:,
        // which is important because Chrome re-orders numerical-seeming keys :/
        [Key in keyof E extends `$${infer X}` ? X : keyof E]: Variable<string>
      }
      space: {
        [Key in keyof F extends `$${infer X}` ? X : keyof F]: Variable<number>
      }
      size: {
        [Key in keyof G extends `$${infer X}` ? X : keyof G]: Variable<number>
      }
      radius: {
        [Key in keyof H extends `$${infer X}` ? X : keyof H]: Variable<number>
      }
      zIndex: {
        [Key in keyof J extends `$${infer X}` ? X : keyof J]: Variable<number>
      }
    }
  : never

// test
const tokens = createTokens({
  size: { 0: 1 },
  space: { 0: 1 },
  radius: { 0: 1 },
  zIndex: { 0: 1 },
  color: { 0: 'hi' },
})
