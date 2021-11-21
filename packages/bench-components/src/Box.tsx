import { styled } from '@tamagui/core'

import { View } from './View'

export const Box = styled(View, {
  alignSelf: 'flex-start',
  backgroundColor: 'transparent',

  variants: {
    color: {
      0: {
        backgroundColor: '#14171A',
      },
      1: {
        backgroundColor: '#AAB8C2',
      },
      2: {
        backgroundColor: '#E6ECF0',
      },
      3: {
        backgroundColor: '#FFAD1F',
      },
      4: {
        backgroundColor: '#F45D22',
      },
      5: {
        backgroundColor: '#E0245E',
      },
    },

    layout: {
      column: {
        flexDirection: 'column',
      },
      row: {
        flexDirection: 'row',
      },
    },

    outer: {
      true: {
        padding: '4px',
      },
    },

    fixed: {
      true: {
        width: '6px',
        height: '6px',
      },
    },
  },
})
