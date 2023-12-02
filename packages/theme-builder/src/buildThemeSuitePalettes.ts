import { hsla, parseToHsla, toHex } from 'color2k'

import { getThemeSuiteScale } from './buildThemeSuiteScales'
import { BuildTheme, BuildThemeSuitePalettes } from './types'

/**
 * palette generally is:
 *
 * [constrastBackground, backgroundTransparent, ...background, ...foreground, foregroundTransparent, accentForeground]
 */

const generateColorPalette = ({
  theme,
  scheme,
  forAccent,
}: {
  theme: BuildTheme
  scheme: 'light' | 'dark'
  forAccent?: boolean
}) => {
  // const { color, scale, accent, accentColor, accentScale } = theme

  const color = forAccent ? theme.accent || theme.color : theme.color
  const scale = forAccent ? theme.accentScale || theme.scale : theme.scale

  const { lumScale, satScale } = getThemeSuiteScale(theme, forAccent)
  const [hue, sat, lum] = parseToHsla(color)
  const isDark = scheme === 'dark'

  const lumValues = isDark ? lumScale.dark : lumScale.light

  let palette: string[] = lumValues.map((lum, idx) => {
    if (sat > 0) {
      if (satScale) {
        return hsla(hue, satScale[scheme][idx], lum, 1)
      }
      return hsla(hue, sat, lum, 1)
    }
    return hsla(0, 0, lum, 1)
  })

  const [background] = palette
  const foreground = palette[palette.length - 1]

  const transparentValues = [background, foreground].map((color) => {
    const [h, s, l] = parseToHsla(color)
    // fully transparent to partially
    return [
      hsla(h, s, l, 0),
      hsla(h, s, l, 0.25),
      hsla(h, s, l, 0.5),
      hsla(h, s, l, 0.75),
    ] as const
  })
  const reverseForeground = [...transparentValues[1]].reverse()
  palette = [...transparentValues[0], ...palette, ...reverseForeground]

  if (theme.accent) {
    const baseAccent = forAccent ? theme.color : theme.accent
    const accentHsla = parseToHsla(baseAccent)
    const accentLum = accentHsla[2]
    const isAccentLight = accentLum > 0.5

    const oppositeLightnessAccent = isAccentLight
      ? toHex(hsla(accentHsla[0], accentHsla[1], 1 - accentLum, 1))
      : theme.accent

    const fg = isAccentLight && !isDark ? oppositeLightnessAccent : baseAccent
    const bg = fg === baseAccent ? oppositeLightnessAccent : baseAccent

    // unshift bg
    palette.unshift(bg)
    // push color
    palette.push(fg)
  } else {
    // were keeping the palettes the same length with or without accent to avoid headache
    palette.unshift('rgba(0,0,0,0)')
    palette.push('rgba(0,0,0,0)')
  }

  return palette
}

export function getThemeSuitePalettes(theme: BuildTheme): BuildThemeSuitePalettes {
  return {
    light: generateColorPalette({ theme, scheme: 'light' }),
    lightAccent: generateColorPalette({ theme, scheme: 'light', forAccent: true }),
    dark: generateColorPalette({ theme, scheme: 'dark' }),
    darkAccent: generateColorPalette({ theme, scheme: 'dark', forAccent: true }),
  }
}
