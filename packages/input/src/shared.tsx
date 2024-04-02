import { isWeb } from '@tamagui/constants'

export const defaultStyles = {
  size: '$true',
  fontFamily: '$body',
  borderWidth: 1,
  outlineWidth: 0,
  color: '$color',

  ...(isWeb
    ? {
        tabIndex: 0,
      }
    : {
        focusable: true,
      }),

  borderColor: '$borderColor',
  backgroundColor: '$background',

  // this fixes a flex bug where it overflows container
  minWidth: 0,

  hoverStyle: {
    borderColor: '$borderColorHover',
  },

  focusStyle: {
    borderColor: '$borderColorFocus',
  },

  focusVisibleStyle: {
    outlineColor: '$outlineColor',
    outlineWidth: 2,
    outlineStyle: 'solid',
  },
} as const
