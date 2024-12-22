import { isClient } from '@tamagui/constants'
import type {
  FontSizeTokens,
  GenericFont,
  TextProps,
  TextStyle,
  VariantSpreadFunction,
} from '@tamagui/core'
import { getTokens } from '@tamagui/core'

export const getFontSized: VariantSpreadFunction<TextProps, FontSizeTokens> = (
  sizeTokenIn = '$true',
  { font, fontFamily, props }
) => {
  if (!font) {
    return {
      fontSize: sizeTokenIn,
    }
  }

  const sizeToken = sizeTokenIn === '$true' ? getDefaultSizeToken(font) : sizeTokenIn

  const style: TextStyle = {}

  // size related, treat them as overrides
  const fontSize = font.size[sizeToken]
  const lineHeight = font.lineHeight?.[sizeToken]
  const fontWeight = font.weight?.[sizeToken]
  const letterSpacing = font.letterSpacing?.[sizeToken]
  const textTransform = font.transform?.[sizeToken]
  const fontStyle = props.fontStyle ?? font.style?.[sizeToken]
  const color = props.color ?? font.color?.[sizeToken]

  if (fontStyle) style.fontStyle = fontStyle
  if (textTransform) style.textTransform = textTransform
  if (fontFamily) style.fontFamily = fontFamily
  if (fontWeight) style.fontWeight = fontWeight
  if (letterSpacing) style.letterSpacing = letterSpacing
  if (fontSize) style.fontSize = fontSize
  if (lineHeight) style.lineHeight = lineHeight
  if (color) style.color = color

  if (process.env.NODE_ENV === 'development') {
    if (props['debug'] && props['debug'] === 'verbose') {
      console.groupCollapsed('  🔹 getFontSized', sizeTokenIn, sizeToken)
      if (isClient) {
        console.info({ style, props, font })
      }
      console.groupEnd()
    }
  }

  return style
}

const cache = new WeakMap<any, FontSizeTokens>()

function getDefaultSizeToken(font: GenericFont) {
  if (typeof font === 'object' && cache.has(font)) {
    return cache.get(font)!
  }

  // use either font.size if it has true set, or fallback to tokens.size mapping to the same
  const sizeTokens = '$true' in font.size ? font.size : getTokens().size
  const sizeDefault = sizeTokens['$true']
  const sizeDefaultSpecific = sizeDefault
    ? Object.keys(sizeTokens).find(
        (x) => x !== '$true' && sizeTokens[x]['val'] === sizeDefault['val']
      )
    : null

  if (!sizeDefault || !sizeDefaultSpecific) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`No default size is set in your tokens for the "true" key, fonts will be inconsistent.

      Fix this by having consistent tokens across fonts and sizes and setting a true key for your size tokens, or
      set true keys for all your font tokens: "size", "lineHeight", "fontStyle", etc.`)
    }
    return Object.keys(font.size)[3]
  }

  cache.set(font, sizeDefaultSpecific as FontSizeTokens)
  return sizeDefaultSpecific
}
