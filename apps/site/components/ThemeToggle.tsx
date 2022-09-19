import { Monitor, Moon, Sun } from '@tamagui/feather-icons'
import { useThemeSetting } from '@tamagui/next-theme'
import React from 'react'
import { useState } from 'react'
import { Button, ButtonProps, TooltipSimple, useIsomorphicLayoutEffect } from 'tamagui'

const icons = {
  system: Monitor,
  light: Sun,
  dark: Moon,
}

export const ThemeToggle = (props: ButtonProps) => {
  const themeSetting = useThemeSetting()
  const [clientTheme, setClientTheme] = useState<string>('light')

  useIsomorphicLayoutEffect(() => {
    setClientTheme(themeSetting.current || 'light')
  }, [themeSetting.current])

  const Icon = icons[clientTheme]

  return (
    <TooltipSimple groupId="header-actions-theme" label={`Switch theme (${themeSetting.current})`}>
      <Button
        size="$3"
        onPress={themeSetting.toggle}
        {...props}
        aria-label="toggle a light and dark color scheme"
        icon={Icon}
      >
        {/* {theme === 'light' ? <Moon size={12} /> : <SunIcon />} */}
      </Button>
    </TooltipSimple>
  )
}
