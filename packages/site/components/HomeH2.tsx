import { H2, H3, styled } from 'tamagui'

export const HomeH2 = styled(H2, {
  name: 'HomeH2',
  ta: 'center',
  als: 'center',
  size: '$12',
  maw: 720,
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
  px: 30,
  size: '$8',
  letsp: -0.5,
  maw: 580,

  $sm: {
    fow: '400',
    size: '$7',
  },
})
