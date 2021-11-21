import { styled } from '@tamagui/core'

import { Paragraph } from './Paragraph'

export const Title = styled(Paragraph, {
  fontFamily: '$title',
  fontWeight: '700',
  size: '$8',
})

export const H1 = styled(Title, {
  fontFamily: '$title',
  accessibilityRole: 'header',
  size: '$10',
})

export const H2 = styled(Title, {
  fontFamily: '$title',
  accessibilityRole: 'header',
  size: '$9',
})

export const H3 = styled(Title, {
  fontFamily: '$title',
  accessibilityRole: 'header',
  size: '$6',
  fontWeight: '700',
})

export const H4 = styled(Title, {
  fontFamily: '$title',
  accessibilityRole: 'header',
  size: '$5',
})

export const H5 = styled(Title, {
  fontFamily: '$title',
  accessibilityRole: 'header',
  size: '$4',
  color: '$color2',
  fontWeight: '600',
})

export const H6 = styled(Title, {
  fontFamily: '$title',
  accessibilityRole: 'header',
  size: '$4',
  color: '$color3',
  fontWeight: '600',
})
