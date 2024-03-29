import { Monitor, Moon, Sun } from '@tamagui/lucide-icons'
import React from 'react'
import { useState } from 'react'
import type { ButtonProps } from 'tamagui'
import {
  Button,
  TooltipSimple,
  getConfig,
  useDidFinishSSR,
  useIsomorphicLayoutEffect,
  useTheme,
} from 'tamagui'

const icons = {
  system: Monitor,
  light: Sun,
  dark: Moon,
}

export const ThemeToggle = (props: ButtonProps) => {
  const didHydrate = useDidFinishSSR()
  const isDark = didHydrate
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false
  const theme = isDark ? 'dark' : 'light'

  // useIsomorphicLayoutEffect(() => {
  //   document.querySelector('#theme-color')?.setAttribute('content', themeColor)
  //   document.body.style.setProperty('background-color', themeColor, 'important')
  // }, [themeSetting.current, themeSetting.resolvedTheme])

  const Icon = icons[theme]

  return (
    <TooltipSimple groupId="header-actions-theme" label={`Scheme (${theme})`}>
      <Button
        size="$3"
        // onPress={() => }
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
