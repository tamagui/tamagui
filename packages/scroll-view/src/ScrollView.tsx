import { GetProps, styled } from '@tamagui/core'
import { ScrollView as ScrollViewNative } from 'react-native'

export const ScrollView = styled(
  ScrollViewNative,
  {
    name: 'ScrollView',
  },
  {
    isReactNative: true,
  }
)

export type ScrollViewProps = GetProps<typeof ScrollView>
