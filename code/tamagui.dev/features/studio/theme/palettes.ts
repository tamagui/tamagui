import {
  createThemes,
  fromShades,
  levels,
  ramp,
  raise,
  shades,
  type Level,
  type Scheme,
  type ThemeScale,
} from '@tamagui/themes/builder'
import { hsla } from 'color2k'

import type { BuildPalette, BuildThemeSuiteProps } from './types'

export const STUDIO_PALETTE_SIZE = 11

export function normalizePalette(palette: BuildPalette): BuildPalette {
  const maxIndex = Math.max(...palette.anchors.map((anchor) => anchor.index))
  if (maxIndex <= STUDIO_PALETTE_SIZE - 1) return palette

  const anchorsByIndex = new Map(
    palette.anchors.map((anchor) => [
      Math.round((anchor.index / maxIndex) * (STUDIO_PALETTE_SIZE - 1)),
      anchor,
    ])
  )

  return {
    ...palette,
    anchors: [...anchorsByIndex.entries()]
      .sort(([a], [b]) => a - b)
      .map(([index, anchor]) => ({ ...anchor, index })),
  }
}

function generateColorPalette(
  buildPalette: BuildPalette,
  scheme: Scheme
): string[] {
  const { anchors } = normalizePalette(buildPalette)
  const palette: string[] = []

  const add = (h: number, s: number, l: number, a = 1) => {
    palette.push(hsla(h, s, l, a))
  }

  for (const [anchorIndex, anchor] of anchors.entries()) {
    const previous = anchors[anchorIndex - 1]
    if (previous) {
      const steps = anchor.index - previous.index
      for (let step = 1; step < steps; step++) {
        const progress = step / steps
        add(
          previous.hue[scheme] + (anchor.hue[scheme] - previous.hue[scheme]) * progress,
          previous.sat[scheme] + (anchor.sat[scheme] - previous.sat[scheme]) * progress,
          previous.lum[scheme] + (anchor.lum[scheme] - previous.lum[scheme]) * progress,
          (previous.alpha?.[scheme] ?? 1) +
            ((anchor.alpha?.[scheme] ?? 1) - (previous.alpha?.[scheme] ?? 1)) *
              progress
        )
      }
    }

    add(
      anchor.hue[scheme],
      anchor.sat[scheme],
      anchor.lum[scheme],
      anchor.alpha?.[scheme]
    )
  }

  const last = palette.at(-1)
  while (last && palette.length < STUDIO_PALETTE_SIZE) {
    palette.push(last)
  }

  return palette.slice(0, STUDIO_PALETTE_SIZE)
}

export function getThemeSuitePalettes(palette: BuildPalette) {
  return {
    light: generateColorPalette(palette, 'light'),
    dark: generateColorPalette(palette, 'dark'),
  }
}

export function createPalettes(palettes: Record<string, BuildPalette>) {
  return Object.fromEntries(
    Object.entries(palettes).flatMap(([name, palette]) => {
      const built = getThemeSuitePalettes(palette)
      const suffix = name === 'base' ? '' : `_${name}`
      return [
        [`light${suffix}`, built.light],
        [`dark${suffix}`, built.dark],
      ]
    })
  )
}

const lightScale = {
  background: 50,
  'background-hover': 100,
  'background-press': 50,
  'background-focus': 100,
  'border-color': 200,
  'border-color-hover': 300,
  'border-color-press': 200,
  'border-color-focus': 300,
  color: 950,
  'color-hover': 950,
  'color-press': 950,
  'color-focus': 950,
  'placeholder-color': 500,
  'outline-color': 400,
  'shadow-color': 'rgba(0,0,0,0.18)',
  'accent-background': 'accent-light-600',
  'accent-color': 'accent-light-50',
} as const satisfies ThemeScale<string>

const darkScale = {
  ...lightScale,
  background: 950,
  'background-hover': 900,
  'background-press': 950,
  'background-focus': 900,
  'border-color': 800,
  'border-color-hover': 700,
  'border-color-press': 800,
  'border-color-focus': 700,
  color: 50,
  'color-hover': 50,
  'color-press': 50,
  'color-focus': 50,
  'shadow-color': 'rgba(0,0,0,0.48)',
  'accent-background': 'accent-dark-500',
  'accent-color': 'accent-dark-950',
} as const satisfies ThemeScale<string>

export const studioScales = {
  light: {
    1: lightScale,
    2: raise(lightScale, 1),
    3: raise(lightScale, 2),
    4: raise(lightScale, 3),
  },
  dark: {
    1: darkScale,
    2: raise(darkScale, -1),
    3: raise(darkScale, -2),
    4: raise(darkScale, -3),
  },
} as const

export function getStudioThemeTokens(palettes: Record<string, BuildPalette>) {
  const sourcePalettes = palettes.accent
    ? palettes
    : { ...palettes, accent: palettes.base }

  return Object.fromEntries(
    Object.entries(sourcePalettes).flatMap(([name, palette]) => {
      const built = getThemeSuitePalettes(palette)
      return (['light', 'dark'] as const).flatMap((scheme) => {
        const colors = scheme === 'light' ? built.light : [...built.dark].reverse()
        return shades.map((shade, index) => [
          `${name}-${scheme}-${shade}`,
          colors[index],
        ])
      })
    })
  )
}

type StudioRecipe = {
  scheme: Scheme
  palette: string
  level?: Level
}

export function createStudioThemes({ palettes }: BuildThemeSuiteProps) {
  const tokens = { color: getStudioThemeTokens(palettes) }
  const tree = {
    light: { scheme: 'light', palette: 'base-light' },
    dark: { scheme: 'dark', palette: 'base-dark' },
    children: {
      ...levels(),
      ...(palettes.accent && {
        accent: ({ parent }) => ({
          palette: `accent-${parent.scheme}`,
          level: 1,
          children: levels(),
        }),
      }),
      inverse: ({ parent }) => {
        const scheme = parent.scheme === 'light' ? 'dark' : 'light'
        return {
          scheme,
          palette: `base-${scheme}`,
          level: 1,
          children: levels(),
        }
      },
    },
  } as const

  const themes = createThemes(tokens, tree, {
    getTheme: ({ recipe }: { recipe: StudioRecipe }) => ({
      ...ramp(recipe.palette, recipe.scheme),
      ...fromShades(
        recipe.palette,
        studioScales[recipe.scheme][recipe.level ?? 1]
      ),
    }),
  })

  return { themes, tokens }
}
