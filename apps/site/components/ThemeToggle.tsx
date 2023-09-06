import { Monitor, Moon, Sun } from '@tamagui/lucide-icons'
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
  const themeSetting = useThemeSetting()!
  const [clientTheme, setClientTheme] = useState<string>('light')

  useIsomorphicLayoutEffect(() => {
    if (themeSetting.resolvedTheme !== 'system') {
      document
        .querySelector('#theme-color')
        ?.setAttribute(
          'content',
          themeSetting.resolvedTheme === 'light' ? '#fff' : '#050505'
        )
    }

    setClientTheme(themeSetting.current || 'light')
  }, [themeSetting.current, themeSetting.resolvedTheme])

  const Icon = icons[clientTheme]

  return (
    <TooltipSimple
      groupId="header-actions-theme"
      label={`Switch theme (${themeSetting.current})`}
    >
      <Button
        size="$3"
        onPress={themeSetting.toggle}
        {...props}
        aria-label="Toggle light/dark color scheme"
        icon={Icon}
      >
        {/* {theme === 'light' ? <Moon size={12} /> : <SunIcon />} */}
      </Button>
    </TooltipSimple>
  )
}
