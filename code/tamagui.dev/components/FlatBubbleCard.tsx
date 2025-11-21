import { YStack, styled } from 'tamagui'

export const FlatBubbleCard = styled(YStack, {
  p: '$6',
  rounded: '$4',
  borderColor: '$borderColor',
  borderWidth: 1,
  self: 'stretch',
  flex: 1,

  variants: {
    feature: {
      true: {
        minW: 280,
      },
    },

    flat: {
      true: {
        backgroundColor: '$gray1',
      },
    },

    hoverable: {
      true: {
        backgroundColor: 'transparent',
        hoverStyle: {
          borderColor: '$gray5',
          backgroundColor: '$gray2',
        },
      },
    },

    highlight: {
      '...': (val) => ({
        backgroundColor: val,
      }),
    },
  } as const,
})
