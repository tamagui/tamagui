import { Monitor, Moon, Sun } from '@tamagui/lucide-icons'
import { useThemeSetting } from '@tamagui/next-theme'
import React from 'react'
import { useState } from 'react'
import type { ButtonProps } from 'tamagui'
import {
  Button,
  TooltipSimple,
  getConfig,
  useIsomorphicLayoutEffect,
  useTheme,
} from 'tamagui'

const icons = {
  system: Monitor,
  light: Sun,
  dark: Moon,
}

export const ThemeToggle = (props: ButtonProps) => {
  const themeSetting = useThemeSetting()!
  const [clientTheme, setClientTheme] = useState<string>('light')

  useIsomorphicLayoutEffect(() => {
    setClientTheme(themeSetting.current || 'light')

    // a bit janky but let it happen after ThemeNameEffect
    const tm = setTimeout(() => {
      const theme =
        themeSetting.resolvedTheme === 'system'
          ? themeSetting.systemTheme
          : themeSetting.resolvedTheme
      const scheme = theme === 'dark' ? 'dark' : 'light'
      const themeColor = getConfig().themes[scheme].color2?.val

      const hasThemeChangeEffect = document.querySelector('#theme-name-effect')
      if (hasThemeChangeEffect) {
        return
      }

      document.querySelector('#theme-color')?.setAttribute('content', themeColor)
      document.body.style.setProperty('background-color', themeColor, 'important')
    })

    return () => {
      clearTimeout(tm)
    }
  }, [themeSetting.current, themeSetting.resolvedTheme])

  const Icon = icons[clientTheme]

  return (
    <TooltipSimple
      groupId="header-actions-theme"
      label={`Scheme (${themeSetting.current})`}
    >
      <Button
        size="$3"
        onPress={themeSetting.toggle}
        {...props}
        aria-label="Toggle light/dark color scheme"
        icon={Icon}
        hoverStyle={{
          bg: 'rgba(0,0,0,0.15)',
        }}
      >
        {/* {theme === 'light' ? <Moon size={12} /> : <SunIcon />} */}
      </Button>
    </TooltipSimple>
  )
}
