import { Moon, Sun, SunMoon } from '@tamagui/lucide-icons'
import { useSystemScheme, useUserScheme } from '@vxrn/color-scheme'
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

const schemeSettings = ['system', 'light', 'dark'] as const

export function useToggleTheme() {
  const userScheme = useUserScheme()
  const systemScheme = useSystemScheme()

  // for faster re renders on heavy pages
  const [val, setVal] = useState(userScheme.setting)

  useEffect(() => {
    if (userScheme.setting !== val) {
      setVal(userScheme.setting)
    }
  }, [userScheme.setting])

  const Icon = val === 'system' ? SunMoon : val === 'dark' ? Moon : Sun

  return {
    setting: userScheme.setting,
    scheme: userScheme.value,
    Icon,
    onPress: () => {
      // Order so that from 'system' we go to opposite first, then cycle through all three
      const order =
        systemScheme === 'light'
          ? ['system', 'dark', 'light'] // system -> dark -> light -> system
          : ['system', 'light', 'dark'] // system -> light -> dark -> system
      const next = order[(order.indexOf(userScheme.setting) + 1) % 3] as (typeof schemeSettings)[number]

      setVal(next)

      setTimeout(() => {
        if (!isWeb) {
          Appearance.setColorScheme(next === 'system' ? userScheme.value : next)
        }

        userScheme.set(next)
      }, 20)
    },
  }
}
