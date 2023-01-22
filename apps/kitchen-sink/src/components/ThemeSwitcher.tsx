import { useThemeName } from '@tamagui/core'
import { Moon, Sun } from '@tamagui/lucide-icons'

import Box from './Box'

type Props = {
  onSwitch: () => void
}

const ThemeSwitcher = ({ onSwitch }: Props) => {
  const themeName = useThemeName()

  return (
    <Box onPress={onSwitch}>
      {themeName === 'light' && <Moon />}
      {themeName === 'dark' && <Sun />}
    </Box>
  )
}

export default ThemeSwitcher
