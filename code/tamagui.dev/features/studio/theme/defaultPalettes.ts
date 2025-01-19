import type { BuildPalette } from './types'

const defaultBasePaletteAnchors: BuildPalette['anchors'] = [
  {
    index: 0,
    hue: { sync: true, light: 0, dark: 0 },
    sat: { sync: true, light: 0.15, dark: 0.15 },
    lum: { light: 0.99, dark: 0.01 },
  },
  {
    index: 9,
    hue: { syncLeft: true, sync: true, light: 0, dark: 0 },
    sat: { syncLeft: true, sync: true, light: 0.15, dark: 0.15 },
    lum: { light: 0.5, dark: 0.5 },
  },
  {
    index: 10,
    hue: { sync: true, light: 0, dark: 0 },
    sat: { sync: true, light: 0.15, dark: 0.15 },
    lum: { light: 0.15, dark: 0.925 },
  },
  {
    index: 11,
    hue: { syncLeft: true, sync: true, light: 0, dark: 0 },
    sat: { syncLeft: true, sync: true, light: 0.15, dark: 0.15 },
    lum: { light: 0.01, dark: 0.99 },
  },
]

const defaultAccentPaletteAnchors: BuildPalette['anchors'] = [
  {
    index: 0,
    hue: { sync: true, light: 250, dark: 250 },
    sat: { sync: true, light: 0.5, dark: 0.5 },
    lum: { light: 0.4, dark: 0.35 },
  },
  {
    index: 9,
    hue: { syncLeft: true, sync: true, light: 250, dark: 250 },
    sat: { syncLeft: true, sync: true, light: 0.5, dark: 0.5 },
    lum: { light: 0.65, dark: 0.6 },
  },
  {
    index: 10,
    hue: { sync: true, light: 250, dark: 250 },
    sat: { sync: true, light: 0.5, dark: 0.5 },
    lum: { light: 0.95, dark: 0.9 },
  },
  {
    index: 11,
    hue: { syncLeft: true, sync: true, light: 250, dark: 250 },
    sat: { syncLeft: true, sync: true, light: 0.5, dark: 0.5 },
    lum: { light: 0.95, dark: 0.95 },
  },
]

export const defaultPalettes = {
  base: {
    name: 'base',
    anchors: defaultBasePaletteAnchors,
  },
  accent: {
    name: 'accent',
    anchors: defaultAccentPaletteAnchors,
  },
}
