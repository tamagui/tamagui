import { H2, H3, styled } from 'tamagui'

export const HomeH2 = styled(H2, {
  name: 'HomeH2',
  ta: 'center',
  als: 'center',
  size: '$11',
  maw: 720,
  mt: '$-2',
  $sm: {
    size: '$10',
  },
  $xs: {
    size: '$9',
  },
})

export const HomeH3 = styled(H3, {
  name: 'HomeH3',
  ta: 'center',
  theme: 'alt2',
  als: 'center',
  size: '$8',
  fow: '400',
  px: 30,
  ls: -0.5,
  maw: 620,

  $sm: {
    size: '$6',
    fow: '400',
    color: '$color',
    textTransform: 'none',
  },
})
