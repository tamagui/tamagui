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
        backgroundColor: 'gray-1',
      },
    },

    hoverable: {
      true: {
        backgroundColor: 'transparent hover:gray-2',
        borderColor: 'hover:gray-5',
      },
    },

    highlight: styled.dynamic<any>((val) => ({
      backgroundColor: val,
    })),
  } as const,
})
