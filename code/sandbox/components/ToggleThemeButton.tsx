// NOTE THIS IS SANDBOX

//  ‼️🚨

import { Moon, Sun, SunMoon } from '@tamagui/lucide-icons'
import { useSystemScheme, useUserScheme } from '@vxrn/color-scheme'
import { useState } from 'react'
import { Appearance } from 'react-native'
import { isWeb, View } from 'tamagui'

const schemeSettings = ['system', 'light', 'dark'] as const

export function ToggleThemeButton() {
  const { onPress, Icon } = useToggleTheme()

  return (
    <View pointerEvents="auto" onPress={onPress}>
      <Icon size={22} />
    </View>
  )
}

export function useToggleTheme() {
  const userScheme = useUserScheme()
  const systemScheme = useSystemScheme()

  // for faster re renders on heavy pages
  const [val, setVal] = useState(userScheme.setting)
  if (userScheme.setting !== val) {
    setVal(userScheme.setting)
  }

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
      const next = order[
        (order.indexOf(userScheme.setting) + 1) % 3
      ] as (typeof schemeSettings)[number]

      setVal(next)

      setTimeout(() => {
        if (!isWeb) {
          Appearance.setColorScheme(next === 'system' ? userScheme.value : next)
        }

        userScheme.set(next)
      }, 250)
    },
  }
}
