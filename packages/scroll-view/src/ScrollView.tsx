import { fullscreenStyle } from '@tamagui/stacks'
import { GetProps, setupReactNative, styled } from '@tamagui/web'
import { ScrollView as ScrollViewNative } from 'react-native'

export const ScrollView = styled(ScrollViewNative, {
  name: 'ScrollView',
  scrollEnabled: true,

  variants: {
    fullscreen: {
      true: fullscreenStyle,
    },
  } as const,
})

export type ScrollView = Pick<ScrollViewNative, 'scrollTo'>

export type ScrollViewProps = GetProps<typeof ScrollView>
