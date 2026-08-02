// runtime theme generation for v6: Tailwind family ramps wired into the v5 theme
// pipeline (createV5Theme), so the palette choice drives the generated theme output.
// this entry pulls @tamagui/theme-builder — it stays out of the static v6 entries,
// the same split as @tamagui/themes/v5 vs v5-builder.
import { createV5Theme } from '@tamagui/themes/v5-builder'
import type { CreateV5ThemeOptions } from '@tamagui/themes/v5-builder'
import { tailwindColors } from './v6-tailwind-colors.generated'
import { toV6Themes } from './v6-themes'
import type { V6Themes } from './v6-themes'

export {
  adjustPalette,
  adjustPalettes,
  createThemes,
  createV5Theme,
  interpolateColor,
  opacify,
  v5Templates,
} from '@tamagui/themes/v5-builder'
export type { CreateV5ThemeOptions } from '@tamagui/themes/v5-builder'

export const TAILWIND_SHADES = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const

type RampStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
type NamedRamp<Name extends string> = { [Key in `${Name}${RampStep}`]: string }
type FamilyRamp<Name extends string> = { light: NamedRamp<Name>; dark: NamedRamp<Name> }

// scheme-relative ramps like radix: family1 = background-side tint, family11 =
// foreground-side. light runs 50 → 950, dark runs 950 → 50.
function familyRamp<Name extends string>(name: Name): FamilyRamp<Name> {
  const flat = tailwindColors as Record<string, string>
  const light: Record<string, string> = {}
  const dark: Record<string, string> = {}
  TAILWIND_SHADES.forEach((shade, index) => {
    light[`${name}${index + 1}`] = flat[`${name}-${shade}`]!
    dark[`${name}${index + 1}`] =
      flat[`${name}-${TAILWIND_SHADES[TAILWIND_SHADES.length - 1 - index]}`]!
  })
  return { light, dark } as FamilyRamp<Name>
}

/** every Tailwind color family as a light/dark ramp ready for createV5Theme */
export const tailwindPalettes = {
  slate: familyRamp('slate'),
  gray: familyRamp('gray'),
  zinc: familyRamp('zinc'),
  neutral: familyRamp('neutral'),
  stone: familyRamp('stone'),
  mauve: familyRamp('mauve'),
  olive: familyRamp('olive'),
  mist: familyRamp('mist'),
  taupe: familyRamp('taupe'),
  red: familyRamp('red'),
  orange: familyRamp('orange'),
  amber: familyRamp('amber'),
  yellow: familyRamp('yellow'),
  lime: familyRamp('lime'),
  green: familyRamp('green'),
  emerald: familyRamp('emerald'),
  teal: familyRamp('teal'),
  cyan: familyRamp('cyan'),
  sky: familyRamp('sky'),
  blue: familyRamp('blue'),
  indigo: familyRamp('indigo'),
  violet: familyRamp('violet'),
  purple: familyRamp('purple'),
  fuchsia: familyRamp('fuchsia'),
  pink: familyRamp('pink'),
  rose: familyRamp('rose'),
} as const

/** default children themes — the same names as v5 so theme="blue" etc never diverge */
export const tailwindChildrenThemes = {
  gray: tailwindPalettes.gray,
  blue: tailwindPalettes.blue,
  red: tailwindPalettes.red,
  yellow: tailwindPalettes.yellow,
  green: tailwindPalettes.green,
  orange: tailwindPalettes.orange,
  pink: tailwindPalettes.pink,
  purple: tailwindPalettes.purple,
  teal: tailwindPalettes.teal,
  neutral: tailwindPalettes.neutral,
} as const

/** base palettes: white + the Tailwind gray ramp (12 steps, background → foreground) */
export const tailwindLightPalette = [
  '#ffffff',
  ...Object.values(tailwindPalettes.gray.light),
]
export const tailwindDarkPalette = [...tailwindLightPalette].reverse()

/**
 * Generates the full v6 Tailwind theme set. Identical shape to the v5 themes
 * (same templates, extras and computed values) — only the palette differs.
 * Pass any createV5Theme option to customize, e.g. add families as children:
 *
 *   createTailwindThemes({
 *     childrenThemes: { ...tailwindChildrenThemes, emerald: tailwindPalettes.emerald },
 *   })
 */
export function createTailwindThemes<
  Children extends Record<
    string,
    { light: Record<string, string>; dark: Record<string, string> }
  > = typeof tailwindChildrenThemes,
>(
  options: CreateV5ThemeOptions<Children> = {} as CreateV5ThemeOptions<Children>
): V6Themes<ReturnType<typeof createV5Theme<Children>>> {
  return toV6Themes(
    createV5Theme<Children>({
      lightPalette: tailwindLightPalette,
      darkPalette: tailwindDarkPalette,
      childrenThemes: tailwindChildrenThemes as unknown as Children,
      ...options,
    })
  )
}
