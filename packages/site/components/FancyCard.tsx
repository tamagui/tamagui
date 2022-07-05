import { YStack, styled } from 'tamagui'

export const FancyCard = styled(YStack, {
  name: 'Card',
  f: 1,
  className: 'transition all ease-in ms100',
  borderRadius: '$6',
  // backgroundColor: '$background',
  flexShrink: 1,
  hoverStyle: {
    borderColor: 'rgba(150,150,150,0.4)',
    elevation: '$6',
    y: '$-1',
  },
})

export const OuterSubtleBorder = styled(YStack, {
  className: 'transition all ease-in ms100',
  borderWidth: 5,
  flex: 1,
  borderColor: 'rgba(150,150,150,0.05)',
  borderRadius: '$7',
})
