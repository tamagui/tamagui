import type { GetProps, GetRef } from '@tamagui/web'
import { styled } from '@tamagui/web'
import { WebScrollView } from './WebScrollView'

export const ScrollView = styled(
  WebScrollView,
  {
    name: 'ScrollView',
    scrollEnabled: true,
  },
  {
    acceptsClassName: true,
    neverFlatten: true,
    accept: {
      contentContainerStyle: 'style',
    } as const,
  }
)

export type ScrollView = GetRef<typeof ScrollView>

export type ScrollViewProps = GetProps<typeof ScrollView>
