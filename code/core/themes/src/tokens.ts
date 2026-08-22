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
  'shadow-1': 'rgba(0, 0, 0, 0.05)',
  'shadow-2': 'rgba(0, 0, 0, 0.08)',
  'shadow-3': 'rgba(0, 0, 0, 0.12)',
  'shadow-4': 'rgba(0, 0, 0, 0.16)',
  'shadow-5': 'rgba(0, 0, 0, 0.2)',
  'shadow-6': 'rgba(0, 0, 0, 0.25)',
  'shadow-7': 'rgba(0, 0, 0, 0.3)',
} as const

export const tokens = { color: colorTokens } as const

export type ColorTokenName = keyof typeof colorTokens
