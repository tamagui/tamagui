import { FontSizeTokens, FontTokens, getTokens, isVariable } from '@tamagui/core'

type GetFontSizeOpts = {
  relativeSize?: number
  font?: FontTokens
}

export const getFontSize = (
  inSize: FontSizeTokens | null | undefined,
  opts?: GetFontSizeOpts
): number => {
  const res = getFontSizeVariable(inSize, opts)
  if (isVariable(res)) {
    return +res.val
  }
  return res ? +res : 16
}

export const getFontSizeVariable = (
  inSize: FontSizeTokens | null | undefined,
  opts?: GetFontSizeOpts
) => {
  const token = getFontSizeToken(inSize, opts)
  if (!token) {
    return inSize
  }
  const tokens = getTokens()
  return tokens.font[opts?.font || '$body'].size[token]
}

export const getFontSizeToken = (
  inSize: FontSizeTokens | null | undefined,
  opts?: GetFontSizeOpts
): FontSizeTokens | null => {
  if (typeof inSize === 'number') {
    return null
  }
  const size = inSize || '$4'
  const relativeSize = opts?.relativeSize || 0
  if (relativeSize === 0) {
    return size
  }
  const tokens = getTokens()
  const fontSize = tokens.font[opts?.font || '$body'].size
  const sizeTokens = Object.keys(fontSize)
  const tokenIndex = Math.min(
    Math.max(0, sizeTokens.indexOf(size) + relativeSize),
    sizeTokens.length - 1
  )
  return (sizeTokens[tokenIndex] ?? size) as FontSizeTokens
}
