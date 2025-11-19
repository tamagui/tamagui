import { YStack, styled } from 'tamagui'

export const FlatBubbleCard = styled(YStack, {
  padding: '$6',
  borderRadius: '$4',
  borderColor: '$borderColor',
  borderWidth: 1,
  alignSelf: 'stretch',
  flex: 1,

  variants: {
    feature: {
      true: {
        minWidth: 280,
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
