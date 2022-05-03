import { useTheme } from '@components/NextTheme'
import { Monitor, Moon, Sun } from '@tamagui/feather-icons'
import { memo, useEffect, useState } from 'react'
import { SectionList } from 'react-native'
import { Button, ButtonProps, useIsomorphicLayoutEffect } from 'tamagui'

const icons = {
  system: Monitor,
  light: Sun,
  dark: Moon,
}

export const ThemeToggle = (props: ButtonProps) => {
  const { theme, toggleTheme } = useTheme()
  const [clientTheme, setClientTheme] = useState<string>('light')

  useIsomorphicLayoutEffect(() => {
    setClientTheme(theme || 'light')
  }, [theme])

  const Icon = icons[clientTheme]

  return (
    <Button
      onPress={toggleTheme}
      {...props}
      aria-label="toggle a light and dark color scheme"
      icon={Icon}
      scaleIcon={0.5}
    >
      {/* {theme === 'light' ? <Moon size={12} /> : <SunIcon />} */}
    </Button>
  )
}
