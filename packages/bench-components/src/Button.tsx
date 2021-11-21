import { Stack, styled } from '@tamagui/core'

export const Button = styled(Stack, {
  tag: 'button',
  alignItems: 'center',
  flexShrink: 0,
  justifyContent: 'center',
  backgroundColor: 'white',
  borderColor: '#999',
  borderWidth: 1,
  borderRadius: 3,
  height: 25,
  paddingLeft: 10,
  paddingRight: 10,

  variants: {
    disabled: {
      true: {
        backgroundColor: 'gray',
        // shadowColor: 'inset 0 0 0 1px gray',
        shadowColor: 'gray',
        pointerEvents: 'none',
      },
    },

    active: {
      true: {
        backgroundColor: 'gray',
      },
    },

    size: {
      1: {
        borderRadius: '2',
        height: 25,
        paddingHorizontal: 10,
      },
      2: {
        borderRadius: '3',
        height: 35,
        paddingHorizontal: 15,
      },
    },

    blue: {
      true: {
        backgroundColor: 'blue',
        borderColor: 'gray',
      },
    },
    red: {
      true: {
        backgroundColor: 'blue',
        borderColor: 'gray',
      },
    },
  },
})
