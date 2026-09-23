import { H1, H2, H3, styled } from 'tamagui'

export const HomeH1 = styled(H1, {
  mb: '1-5',
  color: 'color-11',
  fontSize: 'md:10',
  lineHeight: 'md:10',
  maxW: 'md:90%',
  className: 'word-break-keep-all',
  size: '9',
})

export const HomeH2 = styled(H2, {
  className: 'word-break-keep-all',
  displayName: 'HomeH2',
  text: 'center',
  self: 'center',
  maxW: 720,
  mt: '-1-5',
  fontSize: 'max-md:10 max-sm:9',
  lineHeight: 'max-md:10 max-sm:9',
  size: '10',
})

export const HomeH3 = styled(H3, {
  className: 'word-break-keep-all',
  size: '8',
  text: 'center',
  color: 'color-10 max-md:color',
  self: 'center',
  px: 20,
  opacity: 0.9,
  maxW: 720,
  fontSize: 'max-md:6',
  lineHeight: 'max-md:6',
  fontWeight: 'max-md:400',
  textTransform: 'max-md:none',
  displayName: 'HomeH3',
})
