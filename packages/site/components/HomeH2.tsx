import { H2, H3, styled } from 'tamagui'

export const HomeH2 = styled(H2, {
  mt: -20,
  ta: 'center',
  als: 'center',
  letterSpacing: -2,
  size: '$10',

  $sm: {
    size: '$8',
    letterSpacing: -1,
  },
})

export const HomeH3 = styled(H3, {
  ta: 'center',
  theme: 'alt2',
  als: 'center',
  fow: '400',
  size: '$8',

  $sm: {
    size: '$6',
    fontWeight: '400',
  },
})
