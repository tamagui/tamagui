import type { FontSizeTokens, FontTokens, TamaguiInternalConfig } from '@tamagui/core'
import { getConfig, isVariable } from '@tamagui/core'

type GetFontSizeOpts = {
  relativeSize?: number
  font?: FontTokens
}

const getFontKey = (conf: TamaguiInternalConfig, opts?: GetFontSizeOpts) => {
  const FALLBACK_FONT_KEY = '$body'

  return opts?.font || conf.settings?.defaultFont || FALLBACK_FONT_KEY
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
  const conf = getConfig()
  return conf.fontsParsed[getFontKey(conf, opts)].size[token]
}

export const getFontSizeToken = (
  inSize: FontSizeTokens | null | undefined,
  opts?: GetFontSizeOpts
): FontSizeTokens | null => {
  if (typeof inSize === 'number') {
    return null
  }
  // backwards compat
  const relativeSize = opts?.relativeSize || 0
  const conf = getConfig()
  const fontSize = conf.fontsParsed[getFontKey(conf, opts)].size
  const size =
    (inSize === '$true' && !('$true' in fontSize) ? '$4' : inSize) ??
    ('$true' in fontSize ? '$true' : '$4')
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
