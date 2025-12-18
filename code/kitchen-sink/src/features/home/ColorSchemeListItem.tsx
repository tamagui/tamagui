import type { ListItemProps } from 'tamagui'
import { ListItem, SizableText, View, XStack } from 'tamagui'
import { Pressable } from 'react-native'
import { useThemeControl, ThemeMode } from '../../useKitchenSinkTheme'

const modes: ThemeMode[] = ['system', 'light', 'dark']
const modeLabels: Record<ThemeMode, string> = {
  system: '⚙️ System',
  light: '☀️ Light',
  dark: '🌙 Dark',
}

export const ColorSchemeListItem = (props: ListItemProps) => {
  return (
    <ListItem {...props} bg="$color1" paddingVertical={0}>
      <ListItem.Text>Theme</ListItem.Text>
      <View flex={1} />
      <ColorSchemeToggle />
    </ListItem>
  )
}

export const ColorSchemeToggle = () => {
  const { mode, set } = useThemeControl()

  const cycleMode = () => {
    const currentIndex = modes.indexOf(mode)
    const nextIndex = (currentIndex + 1) % modes.length
    set(modes[nextIndex])
  }

  return (
    <Pressable onPress={cycleMode}>
      <XStack items="center" px="$2" py="$1" rounded="$2" bg="$color3">
        <SizableText size="$3" fontWeight="600">
          {modeLabels[mode]}
        </SizableText>
      </XStack>
    </Pressable>
  )
}
