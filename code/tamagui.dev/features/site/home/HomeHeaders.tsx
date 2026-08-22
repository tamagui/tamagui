import { H1, H2, H3, styled } from 'tamagui'

export const HomeH1 = styled(H1, {
  fontFamily: 'mono',
  mb: '2',
  color: 'color11',
  fontSize: 'gtSm:10',
  lineHeight: 'gtSm:10',
  maxW: 'gtSm:90%',
  className: 'word-break-keep-all',
  size: '9',
})

export const HomeH2 = styled(H2, {
  className: 'word-break-keep-all',
  displayName: 'HomeH2',
  text: 'center',
  self: 'center',
  maxW: 720,
  mt: '-2',
  fontSize: 'sm:10 xs:9',
  lineHeight: 'sm:10 xs:9',
  size: '10',
  letterSpacing: '-0.25px xs:-0.1px',
})

export const HomeH3 = styled(H3, {
  className: 'word-break-keep-all',
  fontFamily: 'mono',
  size: '8',
  text: 'center',
  color: 'color10 sm:color',
  self: 'center',
  px: 20,
  opacity: 0.9,
  letterSpacing: '-0.5px sm:0px',
  maxW: 720,
  fontSize: 'sm:6',
  lineHeight: 'sm:6',
  fontWeight: 'sm:400',
  textTransform: 'sm:none',
  displayName: 'HomeH3',
})
