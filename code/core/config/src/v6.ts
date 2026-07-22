// v6 — Tailwind-aligned defaults end to end: the aligned shorthands/scales/settings from
// v6-base, the Tailwind palette as color tokens, and themes generated FROM that palette.
// prefer the v5 colors? use @tamagui/config/v6-classic. bring your own? compose
// createV6Config (v6-base) with themes from @tamagui/config/v6-builder.
// no animations bundled — users import a driver from specific paths (mirrors v5).
import type { CreateTamaguiProps } from '@tamagui/web'
import { createV6Config, tokens as baseTokens } from './v6-base'
import type { V6Colors } from './v6-base'
import { tailwindColors } from './v6-tailwind-colors.generated'
import { themes } from './v6-tailwind-themes.generated'

export * from './v6-base'
export { tailwindColors } from './v6-tailwind-colors.generated'
export { themes } from './v6-tailwind-themes.generated'
export type {
  Theme as V6Theme,
  ThemeNames as V6ThemeNames,
  Themes as V6Themes,
} from './v6-tailwind-themes.generated'

/** the Tailwind colors pack: color tokens + themes generated from the same palette */
export const colors = {
  themes,
  colorTokens: tailwindColors,
} satisfies V6Colors

export const tokens = {
  ...baseTokens,
  color: tailwindColors,
} as const

export const defaultConfig = createV6Config(colors) satisfies CreateTamaguiProps
