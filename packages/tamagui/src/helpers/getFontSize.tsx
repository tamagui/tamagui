import { FontTokens, SizeTokens, Variable, getTokens } from '@tamagui/core'

type GetFontSizeOpts = {
  relativeSize?: number
  font?: FontTokens
}

export const getFontSize = (inSize: SizeTokens | null | undefined, opts?: GetFontSizeOpts) => {
  const res = getFontSizeVariable(inSize, opts)
  if (res instanceof Variable) {
    return res.val
  }
  return res ?? 16
}

export const getFontSizeVariable = (
  inSize: SizeTokens | null | undefined,
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
  inSize: SizeTokens | null | undefined,
  opts?: GetFontSizeOpts
): SizeTokens => {
  const size = inSize || '$4'
  const relativeSize = opts?.relativeSize || 0
  if (relativeSize === 0) {
    return size
  }
  const tokens = getTokens()
  const fontSize = tokens.font[opts?.font || '$body'].size
  const sizeTokens = Object.keys(fontSize)
  return (sizeTokens[Math.max(1, sizeTokens.indexOf(size) + relativeSize)] ?? size) as SizeTokens
}
