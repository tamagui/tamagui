import { hsla, parseToHsla } from 'color2k'
import type { BuildPalette } from '@tamagui/themes'

/**
 * palette generally is:
 *
 * [constrastBackground, accent, backgroundTransparent, ...background, ...foreground, foregroundTransparent, accentForeground]
 */

const paletteSize = 12

// how many things come before the actual bg color (transparencies etc)
export const PALETTE_BACKGROUND_OFFSET = 6

const generateColorPalette = ({
  palette: buildPalette,
  scheme,
}: {
  palette: BuildPalette
  scheme: 'light' | 'dark'
}) => {
  if (!buildPalette) {
    return [] as string[]
  }

  const { anchors } = buildPalette

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

  // add transparent values
  const background = palette[3]
  const foreground = palette[palette.length - 3]

  const transparentValues = [background, foreground].map((color) => {
    const [h, s, l] = parseToHsla(color)
    // fully transparent to partially
    return [
      hsla(h, s, l, 0),
      hsla(h, s, l, 0.2),
      hsla(h, s, l, 0.4),
      hsla(h, s, l, 0.6),
      hsla(h, s, l, 0.8),
    ] as const
  })
  const reverseForeground = [...transparentValues[1]].reverse()
  palette = [...transparentValues[0], ...palette, ...reverseForeground]

  return palette
}

export function getThemeSuitePalettes(palette: BuildPalette) {
  return {
    light: generateColorPalette({ palette, scheme: 'light' }),
    dark: generateColorPalette({ palette, scheme: 'dark' }),
  }
}
