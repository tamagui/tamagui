import { hsla, parseToHsla } from 'color2k'

import { BuildTheme, BuildThemeSuitePalettes } from './types'

/**
 * palette generally is:
 *
 * [constrastBackground, backgroundTransparent, ...background, ...foreground, foregroundTransparent, accentForeground]
 */

const paletteSize = 12

const generateColorPalette = ({
  theme,
  scheme,
  forAccent,
}: {
  theme: BuildTheme
  scheme: 'light' | 'dark'
  forAccent?: boolean
}) => {
  const baseTheme = forAccent ? theme.accent || theme : theme
  const { anchors } = baseTheme

  let palette: string[] = []

  const add = (h: number, s: number, l: number) => {
    palette.push(hsla(h, s, l, 1))
  }

  const numAnchors = Object.keys(anchors).length

  for (const [anchorIndex, anchor] of anchors.entries()) {
    const [h, s, l] = [anchor.hue[scheme], anchor.sat[scheme], anchor.lum[scheme]]

    if (anchorIndex !== 0) {
      const lastAnchor = anchors[anchorIndex - 1]
      const steps = anchor.index - lastAnchor.index

      const lastHue = lastAnchor.hue[scheme]
      const lastSat = lastAnchor.sat[scheme]
      const lastLum = lastAnchor.lum[scheme]

      const stepHue = (lastHue - h) / steps
      const stepSat = (lastSat - s) / steps
      const stepLum = (lastLum - l) / steps

      // backfill:
      for (let step = lastAnchor.index + 1; step < anchor.index; step++) {
        const str = anchor.index - step
        add(h + stepHue * str, s + stepSat * str, l + stepLum * str)
      }
    }

    add(h, s, l)

    const isLastAnchor = anchorIndex === numAnchors - 1
    if (isLastAnchor && palette.length < paletteSize) {
      // forwardfill:
      for (let step = anchor.index + 1; step < paletteSize; step++) {
        add(h, s, l)
      }
    }
  }

  // if (strategy?.type === 'automatic') {
  //   const hslas = {
  //     background: parseToHsla(strategy.background),
  //     foreground: parseToHsla(strategy.foreground),
  //   }

  //   palette = [
  //     // backgrounds
  //     ...new Array(10).fill(0).map((_, i) => {
  //       const [h, s, l] = hslas.background

  //       if (isDark) {
  //         const str = 9 - i
  //         const minLum = 0.05
  //         const by = (l - minLum) / 10

  //         return hsla(
  //           h,
  //           s,
  //           // go to dark or light
  //           l - by * str,
  //           1
  //         )
  //       } else {
  //         const str = 9 - i
  //         const maxLum = 0.95
  //         const by = (maxLum - l) / 10
  //         return hsla(h, s, l + by * str, 1)
  //       }
  //     }),
  //     // colors
  //     ...new Array(2).fill(0).map((_, i) => {
  //       const [h, s, l] = hslas.foreground
  //       return hsla(
  //         h,
  //         s,
  //         // go to dark or light
  //         l - (i === 0 ? 0.1 : 0) - (forAccent ? 1 - l : 0),
  //         1
  //       )
  //     }),
  //   ]
  // } else {
  //   const lumValues = isDark ? lumScale.dark : lumScale.light
  //   palette = lumValues.map((lum, idx) => {
  //     const sat = satScale[scheme][idx]

  //     if (theme.hueColor && idx >= 10) {
  //       return hsla(theme.hueColor, sat, lum, 1)
  //     }

  //     return hsla(hue, sat, lum, 1)
  //   })
  // }

  // add transparent values
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
    const accentPalette = generateColorPalette({
      theme: theme.accent,
      scheme,
    })

    // unshift bg
    palette.unshift(accentPalette[11])
    // push color
    palette.push(accentPalette[accentPalette.length - 6])
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
