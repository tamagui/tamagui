import { tailwindColors } from './tailwind-colors'

export { tailwindColors }

// the neutral ramp: radix mauve's hue and chroma on a monotonic lightness
// ladder, L* 98 down to 10, about 5 points a rung through the pale end where
// light-mode surfaces stack and widening to 10-15 through the dark end where a
// dark surface needs a bigger step to read at all. tailwind's gray, which this
// replaces, crams four of its eleven steps against white and four more against
// black, so color-9/10/11 all read as one solid black and no level stepping
// through the pale end is visible. monotonic spacing is what makes color-9 land
// around 7:1 (dim but legible) and lets a level read as a level. tailwind gray
// stays available as a palette, it is just not what the default themes ground
// on any more.
const mauveColors = {
  'mauve-50': '#faf9fb',
  'mauve-100': '#eceaee',
  'mauve-200': '#dfdbe3',
  'mauve-300': '#d1cdd7',
  'mauve-400': '#bab7c3',
  'mauve-500': '#a19faa',
  'mauve-600': '#8a8794',
  'mauve-700': '#6a6872',
  'mauve-800': '#54515a',
  'mauve-900': '#3d3a41',
  'mauve-950': '#1c1b1e',
} as const

export const colorTokens = {
  ...tailwindColors,
  ...mauveColors,
  'brand-50': tailwindColors['blue-50'],
  'brand-100': tailwindColors['blue-100'],
  'brand-200': tailwindColors['blue-200'],
  'brand-300': tailwindColors['blue-300'],
  'brand-400': tailwindColors['blue-400'],
  'brand-500': tailwindColors['blue-500'],
  'brand-600': tailwindColors['blue-600'],
  'brand-700': tailwindColors['blue-700'],
  'brand-800': tailwindColors['blue-800'],
  'brand-900': tailwindColors['blue-900'],
  'brand-950': tailwindColors['blue-950'],
} as const

export const tokens = { color: colorTokens } as const

export type ColorTokenName = keyof typeof colorTokens
