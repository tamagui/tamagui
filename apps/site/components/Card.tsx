import { YStack, styled } from 'tamagui'

export const Card = styled(YStack, {
  name: 'Card',
  borderRadius: '$2',
  borderWidth: 2,
  borderColor: '$color5',
  backgroundColor: '$color2',
  flexShrink: 1,
  hoverStyle: {
    borderColor: '$color7',
  },
  pressStyle: {
    backgroundColor: '$backgroundPress',
    y: 0,
  },
})
