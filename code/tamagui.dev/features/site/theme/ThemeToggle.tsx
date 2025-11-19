import { Moon, Sun, SunMoon } from '@tamagui/lucide-icons'
import { useSchemeSetting } from '@vxrn/color-scheme'
import { memo, useEffect, useState } from 'react'
import { Appearance } from 'react-native'
import type { ButtonProps } from 'tamagui'
import { Button, isWeb, TooltipSimple } from 'tamagui'

export const ThemeToggle = memo((props: ButtonProps) => {
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
})

const schemeSettings = ['light', 'dark', 'system'] as const

export function useToggleTheme() {
  const [{ setting, scheme }, setSchemeSetting] = useSchemeSetting()

  // for faster re renders on heavy pages
  const [val, setVal] = useState(setting)

  useEffect(() => {
    if (setting !== val) {
      setVal(setting)
    }
  }, [setting])

  const Icon = val === 'system' ? SunMoon : val === 'dark' ? Moon : Sun

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

      setVal(next)

      setTimeout(() => {
        if (!isWeb) {
          Appearance.setColorScheme(next === 'system' ? scheme : next)
        }

        setSchemeSetting(next)
      }, 20)
    },
  }
}
