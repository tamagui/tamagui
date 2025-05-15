import type { ThemeSuiteItemData } from '../types'

export function themeJSONToText(theme: ThemeSuiteItemData): string {
  const baseAnchors = theme.palettes.base.anchors
  const accentAnchors = theme.palettes.accent.anchors
  const baseText = formatAnchors(baseAnchors)
  const accentText = formatAnchors(accentAnchors)
  return `${baseText}\n\n${accentText}`
}

function formatAnchors(anchors: any[]): string {
  return anchors
    .map((anchor) => {
      const { index, hue, sat, lum } = anchor
      return `${index}: ${hue.light},${hue.dark} ${sat.light},${sat.dark} ${lum.light},${lum.dark}`
    })
    .join('\n')
}
