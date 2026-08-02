// v6-classic — the aligned v6 base (shorthands/scales/settings) with the v5 color story:
// the generated v5 themes, colors provided by themes only (no color tokens), exactly like
// @tamagui/config/v5. static entry: no @tamagui/theme-builder and no Tailwind palette.
import { themes as v5Themes } from '@tamagui/themes/v5'
import type { V5Themes } from '@tamagui/themes/v5'
import type { CreateTamaguiProps } from '@tamagui/web'
import { createV6Config } from './v6-base'
import type { V6Colors } from './v6-base'
import { toV6Themes } from './v6-themes'
import type { V6Themes } from './v6-themes'

export * from './v6-base'

export type V6ClassicThemes = V6Themes<V5Themes>
export const themes: V6ClassicThemes = toV6Themes(v5Themes)
export type V6ClassicThemeNames = keyof V6ClassicThemes
export type V6ClassicTheme = V6ClassicThemes[V6ClassicThemeNames]

/** the classic (v5) colors pack: generated v5 themes, colors live in the themes */
export const colors = { themes } satisfies V6Colors

export const defaultConfig = createV6Config(colors) satisfies CreateTamaguiProps
