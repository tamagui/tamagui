import { YStack, styled } from 'tamagui'

export const Card = styled(YStack, {
  name: 'Card',
  className: 'transition all ease-in ms100',
  borderRadius: '$2',
  backgroundColor: '$background',
  flexShrink: 1,
  elevation: '$2',
  hoverStyle: {
    backgroundColor: '$backgroundHover',
    elevation: '$4',
    y: -4,
  },
})
