import { createVariables } from './createVariables'
import type { CreateTokens, Variable } from './types'

export function createTokens<T extends CreateTokens>(tokens: T): MakeTokens<T> {
  if (process.env.NODE_ENV !== 'production') {
    validateNoTrueTokenKeys(tokens)
  }
  return createVariables(tokens, process.env.TAMAGUI_TOKEN_PREFIX ?? 't') as any
}

function validateNoTrueTokenKeys(tokens: CreateTokens) {
  for (const category in tokens) {
    const tokenSet = tokens[category]
    if (!tokenSet || typeof tokenSet !== 'object') continue

    for (const key of ['true', `$${'true'}`]) {
      if (Object.prototype.hasOwnProperty.call(tokenSet, key)) {
        throw new Error(
          `tokens.${category}.${key} is reserved. Remove the true token key and set settings.defaultSize instead.`
        )
      }
    }
  }
}

type NormalizeTokens<A, Type = A[keyof A]> = {
  [Key in keyof A as Key extends number ? `${Key}` : Key]: Variable<Type>
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
