import {
  getStudioThemeTokens,
  studioScales,
} from '../theme/palettes'
import type { ThemeSuiteItemData } from '../theme/types'

export async function generateThemeBuilderCode({ palettes }: ThemeSuiteItemData) {
  const colorTokens = getStudioThemeTokens(palettes)
  const paletteNames = Object.keys(palettes)
    .flatMap((name) => [`${name}-light`, `${name}-dark`])
    .map((name) => `'${name}'`)
    .join(' | ')
  const accentTree = palettes.accent
    ? `
    accent: ({ parent }: ThemeDefinitionContext) => ({
      palette: parent.scheme === 'dark' ? 'accent-dark' : 'accent-light',
      level: 1,
      children: levels(),
    }),`
    : ''

  return `import {
  createThemes,
  fromShades,
  levels,
  ramp,
  raise,
  type GetThemeContext,
  type ThemeDefinitionContext,
} from '@tamagui/themes/builder'

export const tokens: { color: Record<string, string> } = {
  color: ${JSON.stringify(colorTokens, null, 2)},
}

const light = ${JSON.stringify(studioScales.light[1], null, 2)} as const
const dark = ${JSON.stringify(studioScales.dark[1], null, 2)} as const

export const scales = {
  light: {
    1: light,
    2: raise(light, 1),
    3: raise(light, 2),
    4: raise(light, 3),
  },
  dark: {
    1: dark,
    2: raise(dark, -1),
    3: raise(dark, -2),
    4: raise(dark, -3),
  },
} as const

type Recipe = {
  scheme: 'light' | 'dark'
  palette: ${paletteNames}
  level?: 1 | 2 | 3 | 4
}

export const tree = {
  light: { scheme: 'light', palette: 'base-light' },
  dark: { scheme: 'dark', palette: 'base-dark' },
  children: {
    ...levels(),${accentTree}
    inverse: ({ parent }: ThemeDefinitionContext) => {
      const scheme = parent.scheme === 'light' ? 'dark' : 'light'
      return {
        scheme,
        palette: scheme === 'dark' ? 'base-dark' : 'base-light',
        level: 1,
        children: levels(),
      }
    },
  },
} as const

export function getTheme({ recipe }: GetThemeContext<typeof tokens, Recipe>) {
  return {
    ...ramp(recipe.palette, recipe.scheme),
    ...fromShades(recipe.palette, scales[recipe.scheme][recipe.level ?? 1]),
  }
}

export const themes = createThemes(tokens, tree, { getTheme })
export type Themes = typeof themes
`
}
