import { Circle, styled } from 'tamagui'

export const Glow = styled(Circle, {
  // contain: 'paint',
  className: 'glow',
  rotate: '20deg',
  bg: '$pink10',
  size: 620,
  scaleX: 0.8,
  scaleY: 1.75,
  y: 0,
  o: 0.1,
  pe: 'none',
})
