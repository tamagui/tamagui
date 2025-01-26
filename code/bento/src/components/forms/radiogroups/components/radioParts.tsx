import { View, styled } from 'tamagui'

export const Card = styled(View, {
  cursor: 'pointer',
  width: '100%',
  borderRadius: '$4',
  padding: '$3',
  backgroundColor: '$background',
  borderColor: '$borderColor',
  borderWidth: 1,
  focusStyle: {
    backgroundColor: '$backgroundFocus',
    borderColor: '$borderColorFocus',
  },
  hoverStyle: {
    backgroundColor: '$backgroundHover',
    borderColor: '$borderColorHover',
  },

  ...(process.env.TAMAGUI_TARGET === 'web' && {
    pressStyle: {
      backgroundColor: '$backgroundPress',
      borderColor: '$borderColorPress',
    },
  }),

  variants: {
    active: {
      true: {
        backgroundColor: '$backgroundFocus',
        borderColor: '$borderColorFocus',
      },
    },
  } as const,
})
