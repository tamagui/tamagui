import StaticSafeAreaInsets from 'react-native-static-safe-area-insets'
import type { ThemeName } from 'tamagui'

export const insets = {
  bottom: StaticSafeAreaInsets.safeAreaInsetsBottom || 12,
  top: StaticSafeAreaInsets.safeAreaInsetsTop,
  paddingTop: StaticSafeAreaInsets.safeAreaInsetsTop + 12,
  paddingBottom: StaticSafeAreaInsets.safeAreaInsetsBottom + 12,
}

// 🍓🐙

export type Colors = {
  emoji: string
  theme: ThemeName
  color: string
}

export const colors: Colors[] = [
  {
    emoji: '🐙',
    theme: 'squid',
    color: '#F16A50',
  },
  {
    emoji: '🐳',
    theme: 'whale',
    color: '#5eb0ef',
  },
  {
    emoji: '🐽',
    theme: 'pig',
    color: '#F65CB6',
  },
  {
    emoji: '🥑',
    theme: 'avocado',
    color: '#72a189',
  },
  {
    emoji: '🌼',
    theme: 'yellow',
    color: '#ebbc02',
  },
]
