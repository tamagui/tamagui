import { YStack, styled } from 'tamagui'

export const FlatBubbleCard = styled(YStack, {
  padding: '$6',
  borderRadius: '$3',
  // backgroundColor: '$gray1',
  borderColor: '$gray4',
  hoverStyle: {
    borderColor: '$gray5',
  },
  borderWidth: 1,
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
          backgroundColor: '$gray2',
        },
      },
    },

    highlight: {
      '...': (val) => ({
        backgroundColor: val,
      }),
    },
    // {
    //   // true: {
    //   //   borderWidth: 2,
    //   //   borderColor: '$blue6',
    //   //   // shadowColor: '$blue4',
    //   //   // shadowRadius: 20,
    //   //   // shadowOffset: { height: 3, width: 0 },
    //   // },
    //   // false: {
    //   //   margin: 1,
    //   //   borderWidth: 1,
    //   //   borderColor: '$borderColorPress',
    //   // },
    // },
  },
})
