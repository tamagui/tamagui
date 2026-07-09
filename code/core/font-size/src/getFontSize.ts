import type { FontSizeTokens, FontTokens, Variable } from '@tamagui/core'
import { getConfig, isVariable, resolveDefaultSizeToken } from '@tamagui/core'

type GetFontSizeOpts = {
  relativeSize?: number
  font?: FontTokens
}

export const getFontSize = (
  inSize: FontSizeTokens | true | null | undefined,
  opts?: GetFontSizeOpts
): number => {
  const res = getFontSizeVariable(inSize, opts)
  if (isVariable(res)) {
    return +res.val
  }
  return res ? +res : 16
}

export const getFontSizeVariable = (
  inSize: FontSizeTokens | true | null | undefined,
  opts?: GetFontSizeOpts
): FontSizeTokens | Variable<string> | null | undefined => {
  const token = getFontSizeToken(inSize, opts)
  if (!token) {
    return inSize
  }
  const conf = getConfig()
  const font = conf.fontsParsed[opts?.font || conf.defaultFontToken]
  return font?.size[token as string] as Variable<string>
}

export const getFontSizeToken = (
  inSize: FontSizeTokens | true | null | undefined,
  opts?: GetFontSizeOpts
): FontSizeTokens | null => {
  if (typeof inSize === 'number') {
    return null
  }
  // backwards compat
  const relativeSize = opts?.relativeSize || 0
  const conf = getConfig()
  const font = conf.fontsParsed[opts?.font || conf.defaultFontToken]
  const fontSize =
    font?.size ||
    // fallback to size tokens
    conf.tokensParsed.size
  const size = resolveDefaultSizeToken(inSize ?? true, conf) as string

  const sizeTokens = Object.keys(fontSize).filter((key) => key !== '$true')

  let foundIndex = sizeTokens.indexOf(size)
  if (foundIndex === -1) {
    if (size.endsWith('.5')) {
      foundIndex = sizeTokens.indexOf(size.replace('.5', ''))
    }
  }
  if (process.env.NODE_ENV === 'development') {
    if (foundIndex === -1) {
      console.warn('No font size found', size, opts, 'in size tokens', sizeTokens)
    }
  }
  const tokenIndex = Math.min(
    Math.max(0, foundIndex + relativeSize),
    sizeTokens.length - 1
  )
  return (sizeTokens[tokenIndex] ?? size) as FontSizeTokens
}
