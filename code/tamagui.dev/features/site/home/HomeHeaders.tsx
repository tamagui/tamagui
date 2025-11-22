import { H1, H2, H3, styled } from 'tamagui'

export const HomeH1 = styled(H1, {
  fontFamily: '$mono',
  className: 'word-break-keep-all',
  size: '$9',
  mb: '$2',

  $gtSm: {
    size: '$10',
    maxW: '90%',
  },
})

export const HomeH2 = styled(H2, {
  className: 'word-break-keep-all',
  name: 'HomeH2',
  text: 'center',
  self: 'center',
  size: '$10',
  maxW: 720,
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
  fontFamily: '$mono',
  name: 'HomeH3',
  text: 'center',
  theme: 'alt1',
  self: 'center',
  px: 20,
  size: '$8',
  opacity: 0.9,
  letterSpacing: -0.5,
  maxW: 720,

  $sm: {
    size: '$6',
    fontWeight: '400',
    color: '$color',
    textTransform: 'none',
  },
})
