import { getTokenValue, styled, XStack } from 'tamagui'

export const Button = styled(XStack, {
  cur: 'pointer',
  tag: 'a',
  className: 'text-underline-none',

  bg: '$color2',

  hoverStyle: {
    bg: '$color3',
  },

  pressStyle: {
    bg: '$color1',
  },

  variants: {
    size: {
      '...size': (size = '$4') => {
        const sizeVal = +getTokenValue(size as any, 'size') / 3

        return {
          px: sizeVal,
          py: sizeVal * 1.5,
        }
      },
    },
  },
})
