import { Circle, styled } from 'tamagui'

export const Glow = styled(Circle, {
  // contain: 'strict',
  className: 'glow',
  rotate: '20deg',
  bc: '$green10',
  size: 680,
  scaleX: 1.25,
  scaleY: 1.75,
  y: 0,
  o: 0.075,
  pe: 'none',
})
