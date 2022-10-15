import { H1, H2, H3, styled } from 'tamagui'

export const HomeH1 = styled(H1, {
  className: 'word-break-keep-all',
  size: '$9',
  mb: '$2',

  $gtSm: {
    size: '$10',
    maxWidth: '90%',
  },
})

export const HomeH2 = styled(H2, {
  className: 'word-break-keep-all',
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
  className: 'word-break-keep-all',
  fontFamily: '$body',
  name: 'HomeH3',
  ta: 'center',
  theme: 'alt1',
  als: 'center',
  fow: '400',
  px: 20,
  size: '$8',
  ls: -0.15,
  maw: 690,

  $sm: {
    fow: '400',
    size: '$6',
    color: '$color',
    textTransform: 'none',
  },
})
