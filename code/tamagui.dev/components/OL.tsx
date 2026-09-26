import { YStack, styled } from 'tamagui'

export const OL = styled(YStack, {
  render: 'ol',
  my: '1-5',
  pl: '8',
  style: {
    listStyleType: 'decimal',
    listStylePosition: 'outside',
  },
})
