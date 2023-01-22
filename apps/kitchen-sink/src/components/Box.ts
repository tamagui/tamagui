import { Stack, styled } from '@tamagui/core'
import { StyleSheet } from 'react-native'

const Box = styled(Stack, {
  variants: {
    shadow: {
      sm: {
        elevation: 1,
        shadowColor: '$shadow',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      md: {
        elevation: 6,
        shadowColor: '$shadow',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      lg: {
        elevation: 12,
        shadowColor: '$shadow',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
    },
    boxSize: {
      '...size': (value, { tokens }) => {
        return {
          width: tokens.size[value as keyof typeof tokens.size] ?? value,
          height: tokens.size[value as keyof typeof tokens.size] ?? value,
        }
      },
    },
    contentCenter: {
      true: {
        ai: 'center',
        jc: 'center',
      },
    },
    pin: {
      full: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    },
    edges: {
      ':number': (value: number) => {
        return {
          top: value,
          left: value,
          right: value,
          bottom: value,
        }
      },
    },
    edgesX: {
      ':number': (value: number) => {
        return {
          left: value,
          right: value,
        }
      },
    },
    edgesY: {
      ':number': (value: number) => {
        return {
          top: value,
          bottom: value,
        }
      },
    },
    thin: {
      true: {
        h: StyleSheet.hairlineWidth,
      },
    },
  } as const,
})

export default Box
