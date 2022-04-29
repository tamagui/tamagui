import { H2, H3, styled } from 'tamagui'

export const HomeH2 = styled(H2, {
  ta: 'center',
  als: 'center',
  size: '$12',
  maw: 780,

  $sm: {
    size: '$11',
  },

  $xs: {
    size: '$9',
  },
})

export const HomeH3 = styled(H3, {
  ta: 'center',
  theme: 'alt4',
  als: 'center',
  fow: '400',
  size: '$8',
  maw: 570,

  $sm: {
    size: '$7',
  },

  $xs: {
    size: '$6',
    fontWeight: '400',
  },
})
