import type { ThemeSuiteItemData } from '~/features/studio/theme/types'

export const freeThemes = [
  { id: 1980, label: 'B/W', slug: 'black-and-white-hi-contrast' },
  { id: 1951, label: 'Ocean', slug: 'ocean-blue-theme' },
  { id: 82, label: 'SUPER', slug: 'supreme' },
  { id: 53, label: 'Cactus', slug: 'desert' },
  { id: 37, label: 'Neon', slug: 'nike-neon' },
] as const

export type FreeTheme = {
  id: number
  label: string
  slug: string
  searchQuery: string
  themeData: ThemeSuiteItemData
}
