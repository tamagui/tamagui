import StaticSafeAreaInsets from 'react-native-static-safe-area-insets'
import type { ThemeName } from 'tamagui'

export const insets = {
  bottom: StaticSafeAreaInsets.safeAreaInsetsBottom || 12,
  top: StaticSafeAreaInsets.safeAreaInsetsTop,
  paddingTop: StaticSafeAreaInsets.safeAreaInsetsTop + 12,
  paddingBottom: StaticSafeAreaInsets.safeAreaInsetsBottom + 12,
}

export const colors: { theme: ThemeName; color: string }[] = [
  {
    theme: 'red',
    color: '#F16A50',
  },
  {
    theme: 'orange',
    color: '#ea8f90',
  },
  {
    theme: 'yellow',
    color: '#ebbc02',
  },
  {
    theme: 'green',
    color: '#72a189',
  },
  {
    theme: 'blue',
    color: '#5eb0ef',
  },
  {
    theme: 'purple',
    color: '#e28dc2',
  },
  {
    theme: 'pink',
    color: '#F65CB6',
  },
]
