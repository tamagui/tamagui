import { Variable } from './createVariable'
import { createVariables } from './createVariables'
import { CreateTokens } from './types'

// tokens.color.dark.red ===> { var: `color-dark-red`, val: '' }
export function createTokens<T extends CreateTokens>(tokens: T): MakeTokens<T> {
  return createVariables(tokens as any) as any
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
        [key in keyof E]: Variable
      }
      space: {
        [key in keyof F]: Variable
      }
      size: {
        [key in keyof G]: Variable
      }
      radius: {
        [key in keyof H]: Variable
      }
      zIndex: {
        [key in keyof J]: Variable
      }
    }
  : never
