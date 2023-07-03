import { Text, styled } from 'tamagui'

export const Tag = styled(Text, {
  className: 'hero-tag text-decoration-none',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  borderRadius: '$2',
  cursor: 'pointer',
  color: '$color',
  backgroundColor: '$color2',

  hoverStyle: {
    color: '$color',
    backgroundColor: '$color3',
  },

  variants: {
    active: {
      true: {
        color: '$color10',
        backgroundColor: '$color5',

        hoverStyle: {
          color: '$color12',
          backgroundColor: '$color5',
        },
      },
    },
  },
})
