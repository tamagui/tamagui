import type { BuildPalette } from '../types'

const defaultBasePaletteAnchors: BuildPalette['anchors'] = [
  {
    index: 0,
    hue: { sync: true, light: 100, dark: 100 },
    sat: { sync: true, light: 0, dark: 0 },
    lum: { light: 0.985, dark: 0.1 },
  },
  {
    index: 9,
    hue: { syncLeft: true, sync: true, light: 100, dark: 100 },
    sat: { syncLeft: true, sync: true, light: 0, dark: 0 },
    lum: { light: 0.5, dark: 0.5 },
  },
  {
    index: 10,
    hue: { sync: true, light: 100, dark: 100 },
    sat: { sync: true, light: 0, dark: 0 },
    lum: { light: 0.15, dark: 0.925 },
  },
  {
    index: 11,
    hue: { syncLeft: true, sync: true, light: 100, dark: 100 },
    sat: { syncLeft: true, sync: true, light: 0, dark: 0 },
    lum: { light: 0.1, dark: 0.95 },
  },
]

const defaultAccentPaletteAnchors: BuildPalette['anchors'] = [
  {
    index: 0,
    hue: { sync: true, light: 200, dark: 200 },
    sat: { sync: true, light: 0.75, dark: 0.75 },
    lum: { light: 0.4, dark: 0.35 },
  },
  {
    index: 9,
    hue: { syncLeft: true, sync: true, light: 200, dark: 200 },
    sat: { syncLeft: true, sync: true, light: 0.75, dark: 0.75 },
    lum: { light: 0.55, dark: 0.5 },
  },
  {
    index: 10,
    hue: { sync: true, light: 200, dark: 200 },
    sat: { sync: true, light: 0.75, dark: 0.75 },
    lum: { light: 0.95, dark: 0.9 },
  },
  {
    index: 11,
    hue: { syncLeft: true, sync: true, light: 200, dark: 200 },
    sat: { syncLeft: true, sync: true, light: 0.75, dark: 0.75 },
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
