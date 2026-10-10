import type { GetProps, GetRef, StylePiece } from '@tamagui/web'
import { styled } from '@tamagui/web'
import { WebScrollView } from './WebScrollView'

export const ScrollView = styled(
  WebScrollView,
  {
    displayName: 'ScrollView',
    scrollEnabled: true,
  },
  {
    acceptsClassName: true,
    neverFlatten: true,
  }
)

export type ScrollView = GetRef<typeof ScrollView>

export type ScrollViewProps = Omit<
  GetProps<typeof ScrollView>,
  'contentContainerStyle'
> & {
  contentContainerStyle?: StylePiece
}
