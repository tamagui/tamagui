import type {
  FontSizeTokens,
  GenericFont,
  TextProps,
  VariantSpreadFunction,
} from '@tamagui/core'
import { getTokens } from '@tamagui/core'

export const getFontSized: VariantSpreadFunction<TextProps, FontSizeTokens> = (
  sizeTokenIn = '$true',
  { font, fontFamily, props }
) => {
  if (!font) {
    return
  }

  const sizeToken = sizeTokenIn === '$true' ? getDefaultSizeToken(font) : sizeTokenIn

  // size related, treat them as overrides
  const fontSize = font.size[sizeToken]
  const lineHeight = font.lineHeight?.[sizeToken]
  const fontWeight = font.weight?.[sizeToken]
  const letterSpacing = font.letterSpacing?.[sizeToken]
  const textTransform = font.transform?.[sizeToken]

  // not technically size related, treat them as fallbacks
  const fontStyle = props.fontStyle ?? font.style?.[sizeToken]
  const color = props.color ?? font.color?.[sizeToken]

  const style = {
    color,
    fontStyle,
    textTransform,
    fontFamily,
    fontWeight,
    letterSpacing,
    fontSize,
    lineHeight,
  }

  if (process.env.NODE_ENV === 'development') {
    if (props['debug'] && props['debug'] === 'verbose') {
      console.groupCollapsed('  🔹 getFontSized', sizeTokenIn, sizeToken)
      console.info({ style, props, font })
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
