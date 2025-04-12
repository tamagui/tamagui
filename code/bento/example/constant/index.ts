import type { ThemeName } from 'tamagui'

export const insets = {
  bottom: 24,
  top: 24,
  paddingTop: 32,
  paddingBottom: 32,
}

// 🍓🐙

export type Colors = {
  emoji: string
  theme: ThemeName
}

export const colors: Colors[] = [
  {
    emoji: '🦋',
    theme: 'neonBlue',
  },
  {
    emoji: '🦄',
    theme: 'neon',
  },
  {
    emoji: '🐝',
    // @ts-expect-error
    theme: 'bee',
  },
  {
    emoji: '🥑',
    // @ts-expect-error
    theme: 'avocado',
  },
  {
    emoji: '🌋',
    // @ts-expect-error
    theme: 'volcanic',
  },
]