import type { FontSizeTokens } from '@tamagui/web'
import { resolveSizeToken } from '@tamagui/size'
import { styled, Text } from '@tamagui/web'

export const getFontSized = styled.dynamic<FontSizeTokens | number | true>(
  (sizeTokenIn = true, { font, fontFamily }) => {
    if (!font) {
      return {
        fontSize: sizeTokenIn,
      }
    }

    const sizeToken = resolveSizeToken(sizeTokenIn, 'fontSize') as Exclude<
      FontSizeTokens,
      true
    >

    // A raw numeric size (e.g. `fontSize={32}`) is not a token key, so the
    // `font.size` / `font.lineHeight` maps have no entry for it and every lookup
    // below returns undefined. Treat the number as a literal fontSize and leave
    // lineHeight unset, otherwise a stale default token lineHeight survives and
    // clips glyph tops on iOS (see #4028). We don't scale the lineHeight here,
    // leaving it to the platform default for the given font size.
    if (typeof sizeToken === 'number') {
      return {
        fontSize: sizeToken,
        fontFamily,
      }
    }

    // size related, treat them as overrides
    const fontSize = font.size[sizeToken]
    const lineHeight = font.lineHeight?.[sizeToken]
    const fontWeight = font.weight?.[sizeToken]
    const letterSpacing = font.letterSpacing?.[sizeToken]
    const textTransform = font.transform?.[sizeToken]
    const fontStyle = font.style?.[sizeToken]
    const color = font.color?.[sizeToken]

    return {
      color,
      fontFamily,
      fontSize,
      fontStyle,
      fontWeight,
      letterSpacing,
      lineHeight,
      textTransform,
    }
  }
)

export const SizableText = styled(Text, {
  displayName: 'SizableText',
  fontFamily: 'body',

  variants: {
    size: getFontSized,
  } as const,

  defaultVariants: {
    size: true,
  },
})
