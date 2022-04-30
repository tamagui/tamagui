import { H2, H3, styled } from 'tamagui'

export const HomeH2 = styled(H2, {
  name: 'HomeH2',
  ta: 'center',
  als: 'center',
  size: '$12',
  maw: 780,
  mt: '$-2',

  $sm: {
    size: '$11',
  },

  $xs: {
    size: '$10',
  },
})

export const HomeH3 = styled(H3, {
  name: 'HomeH3',
  ta: 'center',
  theme: 'alt3',
  als: 'center',
  fow: '400',
  size: '$8',
  maw: 570,

  $sm: {
    fow: '400',
    size: '$7',
  },
})
