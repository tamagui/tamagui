import { Variable, createVariable } from './createVariable'
import { CreateTokens } from './types'

// tokens.color.dark.red ===>{ var: `color-dark-red`, val: '' }

export function createTokens<T extends CreateTokens>(tokens: T): MakeTokens<T> {
  // @ts-ignore
  return setupTokens(tokens)
}

function setupTokens(tokens: any) {
  return mapTokensToVariables(tokens)
}

export const mapTokensToVariables = (
  tokens: CreateTokens,
  parentPath = ''
): CreateTokens<Variable> => {
  const res = {}
  for (const key in tokens) {
    const val = tokens[key]
    const name = parentPath ? `${parentPath}-${key}` : key
    if (val && typeof val === 'object') {
      res[key] = mapTokensToVariables(tokens[key], name)
    } else {
      res[key] = createVariable({ val, name })
    }
  }
  // @ts-expect-error
  return res
}

// verbose but gives us nice types...
type MakeTokens<T> = T extends {
  font: infer A
  fontSize: infer B
  lineHeight: infer C
  letterSpacing: infer D
  color: infer E
  space: infer F
  size: infer G
  radius: infer H
  zIndex: infer J
}
  ? {
      font: {
        [key in keyof A]: Variable
      }
      fontSize: {
        [key in keyof B]: Variable
      }
      lineHeight: {
        [key in keyof C]: Variable
      }
      letterSpacing: {
        [key in keyof D]: Variable
      }
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
