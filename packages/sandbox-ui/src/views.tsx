import { Text, styled } from 'tamagui'

export const Tag = styled(Text, {
  className: 'hero-tag text-decoration-none',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  borderRadius: '$2',
  px: '$1',
  mx: '$-1',
  cursor: 'pointer',
  color: '$color',
  bc: '$color2',

  hoverStyle: {
    color: '$color',
    bc: '$color3',
  },

  variants: {
    active: {
      true: {
        color: '$color10',
        bc: '$color5',

        hoverStyle: {
          color: '$color12',
          bc: '$color5',
        },
      },
    },
  },
})
