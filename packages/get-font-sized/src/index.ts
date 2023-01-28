import { getTokens, getVariableValue } from '@tamagui/core'
import type {
  FontSizeTokens,
  GenericFont,
  TextProps,
  VariantSpreadFunction,
} from '@tamagui/core'

export const getFontSized: VariantSpreadFunction<TextProps, FontSizeTokens> = (
  sizeTokenIn = '$true',
  { fonts, theme, props }
) => {
  const family = getVariableValue(props.fontFamily) || '$body'
  const font = fonts[family] || fonts['$body']
  if (!font) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('⚠️ no font found', {
        family,
        fontTokens: Object.keys(fonts),
        sizeTokenIn,
      })
    }
    return {} as any
  }
  const fontFamily = font.family
  const sizeToken = sizeTokenIn === '$true' ? getDefaultSizeToken(font) : sizeTokenIn
  const fontSize = props.fontSize || font.size[sizeToken]
  const lineHeight = props.lineHeight || font.lineHeight[sizeToken]
  const fontWeight = props.fontWeight || font.weight[sizeToken]
  const letterSpacing = props.letterSpacing || font.letterSpacing[sizeToken]
  const fontStyle = props.fontStyle || font.style?.[sizeToken]
  const textTransform = props.textTransform || font.transform?.[sizeToken]
  const color = props.color || font.color?.[sizeToken] || theme.color

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
    if (props['debug']) {
      // eslint-disable-next-line no-console
      console.groupCollapsed('  🔹 getFontSized', sizeTokenIn, sizeToken)
      // eslint-disable-next-line no-console
      console.log({ style, props, font })
      // eslint-disable-next-line no-console
      console.groupEnd()
    }
  }
  return style
}

const cache = new WeakMap<any, FontSizeTokens>()

function getDefaultSizeToken(font: GenericFont) {
  if (cache.has(font)) {
    return cache.get(font)!
  }

  // use either font.size if it has true set, or fallback to tokens.size mapping to the same
  const sizeTokens = '$true' in font.size ? font.size : getTokens(true).size
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

  cache.set(font, sizeDefaultSpecific)
  return sizeDefaultSpecific
}
