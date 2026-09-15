import type { FontSizeTokens, FontTokens, Variable } from '@tamagui/core'
import { getConfig, isVariable } from '@tamagui/core'

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
  // `size` is the font scale only. `true` is the default size: the type-scale
  // key when the font carries it, else the numeric default (mirrors
  // getFontSized, so every shipped config keeps its current default).
  const key = String(inSize ?? true).replace(/^\$/, '')
  const size =
    inSize == null || inSize === true
      ? ('sm' in (font?.size ?? {}) ? 'sm' : '4')
      : key

  const sizeTokens = Object.keys(fontSize)

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
