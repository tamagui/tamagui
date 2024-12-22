import { Moon, Sun, SunMoon } from '@tamagui/lucide-icons'
import { useSchemeSetting } from '@vxrn/color-scheme'
import { Appearance } from 'react-native'
import { isWeb, View } from 'tamagui'

const schemeSettings = ['light', 'dark', 'system'] as const

export function ToggleThemeButton() {
  const { onPress, Icon } = useToggleTheme()

  return (
    <View pointerEvents="auto" onPress={onPress}>
      <Icon size={22} />
    </View>
  )
}

export function useToggleTheme() {
  const [{ setting, scheme }, setSchemeSetting] = useSchemeSetting()
  const Icon = setting === 'system' ? SunMoon : setting === 'dark' ? Moon : Sun

  return {
    setting,
    scheme,
    Icon,
    onPress: () => {
      const next =
        setting === 'system'
          ? scheme === 'light'
            ? 'dark'
            : 'light'
          : schemeSettings[(schemeSettings.indexOf(setting) + 1) % 3]

      if (!isWeb) {
        Appearance.setColorScheme(next === 'system' ? scheme : next)
      }

      setSchemeSetting(next)
    },
  }
}
