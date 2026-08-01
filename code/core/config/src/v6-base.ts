// v6 is the opt-in home for breaking Tailwind-compatible defaults, so v5 stays stable.
import { shorthands } from '@tamagui/shorthands/v6'
import { themes as v5themes, tokens as v5tokens, type V5Themes } from '@tamagui/themes/v5'
import type { CreateTamaguiProps } from '@tamagui/web'
import { fonts as v5fonts } from './v5-fonts'
import { media, mediaQueryDefaultActive } from './v5-media'
import { selectionStyles, settings as v5Settings } from './v5-base'
import { v6RemovedThemeNames, v6ThemeNameReplacements } from '@tamagui/style-grammar'
import {
  tailwindColors,
  tailwindFontSize,
  tailwindLineHeight,
  tailwindRadius,
  tailwindSize,
  tailwindSpace,
  tailwindZIndex,
} from './v6-tailwind-tokens'

// inherit all v5 helpers/types/theme re-exports, then override shorthands + defaultConfig
export * from './v5-base'
export { v6RemovedThemeNames, v6ThemeNameReplacements } from '@tamagui/style-grammar'
export { shorthands }

type V6Theme<Theme> = {
  [Name in keyof Theme as Name extends (typeof v6RemovedThemeNames)[number]
    ? never
    : Name extends keyof typeof v6ThemeNameReplacements
      ? (typeof v6ThemeNameReplacements)[Name]
      : Name]: Theme[Name]
}

export type V6Themes = {
  [Name in keyof V5Themes]: V6Theme<V5Themes[Name]>
}

export const themes = Object.fromEntries(
  Object.entries(v5themes).map(([themeName, theme]) => [
    themeName,
    Object.fromEntries(
      Object.entries(theme)
        .filter(([name]) => !(v6RemovedThemeNames as readonly string[]).includes(name))
        .map(([name, value]) => [
          v6ThemeNameReplacements[name as keyof typeof v6ThemeNameReplacements] ?? name,
          value,
        ])
    ),
  ])
) as V6Themes

// space and size deliberately remain separate configured domains even though their default
// values coincide. Radius keeps v5's numeric component scale while adding Tailwind's named
// border-radius scale; v6's z-index names resolve to their direct CSS values.
export const tokens = {
  color: tailwindColors,
  space: tailwindSpace,
  size: tailwindSize,
  radius: { ...v5tokens.radius, ...tailwindRadius },
  zIndex: tailwindZIndex,
} as const

// font px strings are normalized to numeric Variable values by createVariable. keep the same
// public numeric type contract as v5's pinFontToPx while retaining the generated map's exact keys.
type NormalizedPxScale<T extends Record<string, string>> = {
  [Key in keyof T]: number
}

const asNormalizedPxScale = <T extends Record<string, string>>(scale: T) =>
  scale as unknown as NormalizedPxScale<T>

function withTailwindTypeScale<F extends { size: object; lineHeight: object }>(font: F) {
  return {
    ...font,
    size: { ...font.size, ...asNormalizedPxScale(tailwindFontSize) },
    lineHeight: { ...font.lineHeight, ...asNormalizedPxScale(tailwindLineHeight) },
  }
}

export const fonts = {
  body: withTailwindTypeScale(v5fonts.body),
  heading: withTailwindTypeScale(v5fonts.heading),
} satisfies NonNullable<CreateTamaguiProps['fonts']>

export const settings = {
  ...v5Settings,
  defaultSize: '11',
  defaultTokens: {
    space: '4',
    radius: '4',
    zIndex: '4',
    fontSize: '4',
  },
} satisfies CreateTamaguiProps['settings']

export type V6Settings = typeof settings

export const defaultConfig = {
  media,
  shorthands,
  themes,
  tokens,
  fonts,
  selectionStyles,
  settings,
} satisfies CreateTamaguiProps
