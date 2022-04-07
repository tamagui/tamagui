import { styled } from '@tamagui/core'

import { Paragraph } from './Paragraph'

export const Title = styled(Paragraph, {
  tag: 'span',
  name: 'Title',
  accessibilityRole: 'header',
  fontFamily: '$title',
  fontWeight: '700',
  size: '$8',
  margin: 0,
})

export const H1 = styled(Title, {
  name: 'H1',
  tag: 'h1',
  size: '$10',
})

export const H2 = styled(Title, {
  name: 'H2',
  tag: 'h2',
  size: '$9',
})

export const H3 = styled(Title, {
  name: 'H3',
  tag: 'h3',
  size: '$8',
  fontWeight: '700',
})

export const H4 = styled(Title, {
  name: 'H4',
  tag: 'h4',
  size: '$6',
})

export const H5 = styled(Title, {
  name: 'H5',
  tag: 'h5',
  size: '$5',
  fontWeight: '600',
})

export const H6 = styled(Title, {
  name: 'H6',
  tag: 'h6',
  size: '$4',
  fontWeight: '600',
})
