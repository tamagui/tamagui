import type { Variable } from './createVariable'
import { createVariables } from './createVariables'
import type { CreateTokens } from './types'

export function createTokens<T extends CreateTokens>(tokens: T): MakeTokens<T> {
  return createVariables(tokens, process.env.TAMAGUI_TOKEN_PREFIX ?? 't') as any
}

type NormalizeTokens<A, Type = A[keyof A]> = {
  [Key in keyof A extends number ? `${keyof A}` : keyof A]: Variable<Type>
}

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
