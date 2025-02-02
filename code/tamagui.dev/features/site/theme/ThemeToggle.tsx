import { Moon, Sun, SunMoon } from '@tamagui/lucide-icons'
import { useSchemeSetting } from '@vxrn/color-scheme'
import { Appearance } from 'react-native'
import type { ButtonProps } from 'tamagui'
import { Button, isWeb, TooltipSimple } from 'tamagui'

export const ThemeToggle = (props: ButtonProps) => {
  const { onPress, Icon, setting } = useToggleTheme()

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
        size="$3"
        onPress={onPress}
        {...props}
        aria-label="Toggle light/dark color scheme"
        icon={Icon}
        hoverStyle={{
          bg: 'rgba(0,0,0,0.15)',
        }}
      />
    </TooltipSimple>
  )
}

const schemeSettings = ['light', 'dark', 'system'] as const

export function useToggleTheme() {
  const [{ setting, scheme }, setSchemeSetting] = useSchemeSetting()
  const Icon = setting === 'system' ? SunMoon : setting === 'dark' ? Moon : Sun

  return {
    setting,
    scheme,
    Icon,
    onPress: () => {
      const next = schemeSettings[(schemeSettings.indexOf(setting) + 1) % 3]

      if (!isWeb) {
        Appearance.setColorScheme(next === 'system' ? scheme : next)
      }

      setSchemeSetting(next)
    },
  }
}
