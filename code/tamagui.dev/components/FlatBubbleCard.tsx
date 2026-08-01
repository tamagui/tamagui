import { YStack, styled } from 'tamagui'

export const FlatBubbleCard = styled(YStack, {
  p: '6',
  rounded: '4',
  borderColor: 'border-color',
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
        backgroundColor: 'gray1',
      },
    },

    hoverable: {
      true: {
        backgroundColor: 'transparent hover:gray2',
        borderColor: 'hover:gray5',
      },
    },

    highlight: {
      Color: (val) => ({
        backgroundColor: val,
      }),
    },
  } as const,
})
