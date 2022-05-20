import { YStack, styled } from 'tamagui'

export const Pre = styled(YStack, {
  overflow: 'visible',
  tag: 'pre',
  padding: '$4',
  borderRadius: '$4',
  bc: '$background',
  borderWidth: 0.5,
  borderColor: '$borderColorHover',
  my: '$3',
})
