import { YStack, styled } from 'tamagui'

export const OL = styled(YStack, {
  render: 'ol',
  my: '2',
  pl: '6',
  style: {
    listStyleType: 'decimal',
    listStylePosition: 'outside',
  },
})
