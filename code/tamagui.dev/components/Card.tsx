import { YStack, styled } from 'tamagui'

export const Card = styled(YStack, {
  name: 'Card',
  className: 'transition all ease-in ms100',
  borderRadius: '$2',
  borderWidth: 2,
  borderColor: 'transparent',
  backgroundColor: '$background',
  flexShrink: 1,
  elevation: '$1',
  hoverStyle: {
    backgroundColor: '$backgroundHover',
    elevation: '$3',
    y: -4,
  },
  pressStyle: {
    backgroundColor: '$backgroundPress',
    elevation: '$0',
    y: 0,
  },
})
