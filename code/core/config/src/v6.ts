// v6 defaults: aligned scales and the statically generated recipe-tree themes.
// no animations are bundled; import a driver from its specific entry.
import {
  tailwindColors,
  themes,
  tokens as themeTokens,
  type Theme,
  type ThemeNames,
  type Themes,
} from '@tamagui/themes'
import type { CreateTamaguiProps } from '@tamagui/web'
import { createV6Config, tokens as baseTokens } from './v6-base'
import type { V6Colors } from './v6-base'

export * from './v6-base'
export { tailwindColors, themes }
export type { Theme as V6Theme, ThemeNames as V6ThemeNames, Themes as V6Themes }

/** the Tailwind colors pack: color tokens + themes generated from the same palette */
export const colors = {
  themes,
  colorTokens: themeTokens.color,
} satisfies V6Colors

export const tokens = {
  ...baseTokens,
  color: themeTokens.color,
} as const

export const defaultConfig = createV6Config(colors) satisfies CreateTamaguiProps
