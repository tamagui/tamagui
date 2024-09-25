import { Monitor, Moon, Sun } from '@tamagui/lucide-icons'
import { useSchemeSetting } from '@vxrn/color-scheme'
import { Appearance } from 'react-native'
import { Button, TooltipSimple, isWeb } from 'tamagui'

const schemeSettings = ['light', 'dark', 'system'] as const

const icons = {
  system: Monitor,
  light: Sun,
  dark: Moon,
}

export function ToggleThemeButton() {
  const { onPress, setting, Icon } = useToggleTheme()

  return (
    <TooltipSimple
      groupId="header-actions-theme"
      label={
        setting === 'system'
          ? 'System'
          : `${setting[0].toLocaleUpperCase()}${setting.slice(1)}`
      }
    >
      <Button
        chromeless
        size="$3"
        onPress={onPress}
        aria-label="Toggle light/dark color scheme"
        icon={Icon}
        hoverStyle={{
          bg: 'rgba(0,0,0,0.15)',
        }}
      />
    </TooltipSimple>
  )
}

export function useToggleTheme() {
  const [{ setting, scheme }, setSchemeSetting] = useSchemeSetting()
  const Icon = icons[setting]

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
