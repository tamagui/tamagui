import type { FontSizeTokens } from '@tamagui/web'
import { resolveSize } from '@tamagui/size'
import { styled, Text } from '@tamagui/web'

export const getFontSized = styled.dynamic<FontSizeTokens | number | true>(
  (sizeTokenIn = true, env) => {
    const { font, fontFamily } = env
    if (!font) {
      return {
        fontSize: sizeTokenIn,
      }
    }

    // A raw numeric size (e.g. `fontSize={32}`) is not a token key, so the
    // `font.size` / `font.lineHeight` maps have no entry for it and every lookup
    // below returns undefined. Treat the number as a literal fontSize and leave
    // lineHeight unset, otherwise a stale default token lineHeight survives and
    // clips glyph tops on iOS (see #4028). We don't scale the lineHeight here,
    // leaving it to the platform default for the given font size.
    if (typeof sizeTokenIn === 'number') {
      return {
        fontSize: sizeTokenIn,
        fontFamily,
      }
    }

    // `true` and a named size (`md`) read the size recipe's font key, so text
    // sized "md" matches the text inside a "md" control. any other value is a
    // font.size key already (`sm`, `2xl`, `4`).
    const key = String(sizeTokenIn).replace(/^\$/, '')
    const sizeToken = (
      sizeTokenIn === true || env.sizes?.[key] != null
        ? resolveSize(sizeTokenIn, env).fontSizeKey
        : key
    ) as Exclude<FontSizeTokens, true>

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
