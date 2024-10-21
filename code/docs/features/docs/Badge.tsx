import { Paragraph, styled } from 'tamagui'

export const Badge = styled(Paragraph, {
  userSelect: 'none',
  cur: 'default',
  size: '$2',
  px: '$3',
  py: '$2',
  br: '$10',
  lineHeight: '$1',
  variants: {
    variant: {
      red: {
        bg: '$red',
        color: '$redFg',
      },

      blue: {
        bg: '$blue',
        color: '$blueFg',
      },

      green: {
        bg: '$green',
        color: '$greenFg',
      },

      purple: {
        bg: '$purple',
        color: '$purpleFg',
      },

      pink: {
        bg: '$pink',
        color: '$pinkFg',
      },
    },
  } as const,
})
