import { Paragraph, styled } from 'tamagui'

export const P = styled(Paragraph, {
  fontFamily: 'mono',
  color: 'color10',
  lineHeight: '5 gtXs:7',
  px: 'gtXs:8',
  fontSize: 'gtXs:6',
  size: '4',
})

export const BigP = styled(P, {
  theme: 'green',
  size: '5',
  lineHeight: '6 gtXs:9',
  px: 'gtXs:8',
  fontSize: 'gtXs:8',
  color: 'color11',
})
