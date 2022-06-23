import { YStack, styled } from 'tamagui'

export const FancyCard = styled(YStack, {
  name: 'Card',
  p: '$4',
  py: '$5',
  f: 1,
  className: 'transition all ease-in ms100',
  // borderWidth: 1,
  // borderColor: '$borderColorHover',
  borderRadius: '$6',
  // backgroundColor: '$background',
  flexShrink: 1,
  elevation: '$1',
  hoverStyle: {
    // backgroundColor: '$backgroundHover',
    borderColor: 'rgba(150,150,150,0.4)',
    elevation: '$6',
    y: '$-2',
  },
})

export const OuterSubtleBorder = styled(YStack, {
  className: 'transition all ease-in ms100',
  borderWidth: 5,
  flex: 1,
  borderColor: 'rgba(150,150,150,0.05)',
  borderRadius: '$7',
})
