import { tailwindColors } from './tailwind-colors'

export { tailwindColors }

export const colorTokens = {
  ...tailwindColors,
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
