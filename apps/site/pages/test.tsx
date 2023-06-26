import {
  AnimationsDemo,
  AnimationsPresenceDemo,
  ListItemDemo,
  ThemeInverseDemo,
} from '@tamagui/demos'
import { TabsAdvancedDemo } from '@tamagui/demos'
import { LogoWords, TamaguiLogo, ThemeTint } from '@tamagui/logo'
import { ListItem, Square, Stack, Theme, YStack, styled } from 'tamagui'

import { ThemeToggle } from '../components/ThemeToggle'

const TabsRovingIndicator = styled(Stack, {
  position: 'absolute',
  backgroundColor: '$color5',
  opacity: 0.7,
  animation: '100ms',
  enterStyle: {
    opacity: 0,
  },
  exitStyle: {
    opacity: 0,
  },
  variants: {
    active: {
      true: {
        backgroundColor: '$color8',
        opacity: 0.6,
      },
    },
  },
})

// export default () => <Square size={100} animation="quick" bc="$background" />
export default () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      flex: 1,
    }}
  >
    <ThemeDemo />
  </div>
)

const ThemeDemo = () => {
  return (
    <YStack ai="center" fullscreen jc="center">
      <YStack scale={2} pos="absolute" t="$8" space>
        <LogoWords animated />
      </YStack>

      <ThemeTint>
        <ThemeInverseDemo />
      </ThemeTint>

      <YStack pos="absolute" t="$4" r="$4">
        <ThemeToggle />
      </YStack>
    </YStack>
  )
}
