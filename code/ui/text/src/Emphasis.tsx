import { styled, Text } from '@tamagui/web'

export const Strong = styled(Text, {
  render: 'strong',
  fontWeight: 'bold',
})

export const Span = styled(Text, {
  render: 'span',
})

export const Em = styled(Text, {
  render: 'em',
  fontStyle: 'italic',
})
