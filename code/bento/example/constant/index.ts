import StaticSafeAreaInsets from 'react-native-static-safe-area-insets'
import type { ThemeName } from 'tamagui'

export const insets = {
  bottom: StaticSafeAreaInsets?.safeAreaInsetsBottom || 12,
  top: StaticSafeAreaInsets?.safeAreaInsetsTop,
  paddingTop: StaticSafeAreaInsets?.safeAreaInsetsTop + 12,
  paddingBottom: StaticSafeAreaInsets?.safeAreaInsetsBottom + 12,
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
