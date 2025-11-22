import { YStack, styled } from 'tamagui'

export const Card = styled(YStack, {
  name: 'Card',
  className: 'transition all ease-in ms100',
  rounded: '$2',
  borderWidth: 2,
  borderColor: 'transparent',
  bg: '$background',
  shrink: 1,
  elevation: '$1',
  hoverStyle: {
    bg: '$backgroundHover',
    elevation: '$3',
    y: -4,
  },
  pressStyle: {
    bg: '$backgroundPress',
    elevation: '$0',
    y: 0,
  },
})
