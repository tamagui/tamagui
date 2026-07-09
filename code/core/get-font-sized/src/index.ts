import { isClient } from '@tamagui/constants'
import type {
  FontSizeTokens,
  TextProps,
  TextStyle,
  VariantSpreadFunction,
} from '@tamagui/web'
import { resolveDefaultSizeToken, styled, Text } from '@tamagui/web'

export const getFontSized: VariantSpreadFunction<TextProps, FontSizeTokens> = (
  sizeTokenIn = true,
  { font, fontFamily, props }
) => {
  if (!font) {
    return {
      fontSize: sizeTokenIn,
    }
  }

  const sizeToken = resolveDefaultSizeToken(sizeTokenIn) as Exclude<FontSizeTokens, true>

  const style: TextStyle = {}

  // A raw numeric size (e.g. `fontSize={32}`) is not a token key, so the
  // `font.size` / `font.lineHeight` maps have no entry for it and every lookup
  // below returns undefined. Treat the number as a literal fontSize and leave
  // lineHeight unset, otherwise a stale default token lineHeight survives and
  // clips glyph tops on iOS (see #4028). We don't scale the lineHeight here,
  // leaving it to the platform default for the given font size.
  if (typeof sizeToken === 'number') {
    style.fontSize = sizeToken
    if (fontFamily) style.fontFamily = fontFamily
    if (props.fontStyle) style.fontStyle = props.fontStyle
    if (props.color) style.color = props.color
    return style
  }

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

export const SizableText = styled(Text, {
  name: 'SizableText',
  fontFamily: '$body',

  variants: {
    size: {
      '...fontSize': getFontSized,
    },
  } as const,

  defaultVariants: {
    size: true,
  },
})
