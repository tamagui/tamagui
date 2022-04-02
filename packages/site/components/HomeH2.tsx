import { H2, H3, styled } from 'tamagui'

export const HomeH2 = styled(H2, {
  als: 'center',
  size: '$10',
  fontSize: 40,

  $sm: {
    fontSize: 32,
    letterSpacing: -1,
  },
})

export const HomeH3 = styled(H3, {
  ta: 'center',
  theme: 'alt2',
  als: 'center',
  fow: '400',

  // TODO media queries on styled()
  $sm: {
    size: '$4',
  },
})
