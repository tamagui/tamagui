import { YStack, styled } from 'tamagui'

export const UL = styled(YStack, {
  render: 'ul',
  my: '1-5',
  pl: '8',
  style: {
    listStyleType: 'disc',
    listStylePosition: 'outside',
  },
})
