import type { FontSizeTokens } from '@tamagui/web'
import { styled } from '@tamagui/web'

/**
 * `size` is the font scale only: a font.size key, a raw px number, or `true`
 * for the default. `true` reads the type-scale key when the active font
 * carries it, else the numeric default, so every shipped config keeps its
 * current default (`sm` on v6, `4` on v5 and the default config).
 */
export type GetFontSizedInput = FontSizeTokens | number | true

export const getFontSized = styled.dynamic<GetFontSizedInput>(
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

    const key =
      sizeTokenIn === true
        ? ('sm' in font.size ? 'sm' : '4')
        : String(sizeTokenIn).replace(/^\$/, '')
    const sizeToken = key as Exclude<FontSizeTokens, true>

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
