import type { GetProps, GetRef } from '@tamagui/web'
import { styled } from '@tamagui/web'
import { ScrollView as ScrollViewNative } from 'react-native'

export const ScrollView = styled(
  ScrollViewNative,
  {
    displayName: 'ScrollView',
    scrollEnabled: true,
  },
  {
    neverFlatten: true,
    accept: {
      contentContainerStyle: 'style',
    } as const,
  }
)

export type ScrollView = GetRef<typeof ScrollView>

export type ScrollViewProps = GetProps<typeof ScrollView>
