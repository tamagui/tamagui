import { fullscreenStyle } from '@tamagui/stacks'
import type { GetProps } from '@tamagui/web'
import { styled } from '@tamagui/web'
import { ScrollView as ScrollViewNative } from 'react-native'

export const ScrollView = styled(
  ScrollViewNative,
  {
    scrollEnabled: true,
    variants: {
      fullscreen: {
        true: fullscreenStyle,
      },
    } as const,
  },
  {
    name: 'ScrollView',
    accept: {
      contentContainerStyle: 'style',
    } as const,
  }
)

export type ScrollView = Pick<ScrollViewNative, 'scrollTo'>

export type ScrollViewProps = GetProps<typeof ScrollView>
