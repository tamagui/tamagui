import { YStack, styled } from 'tamagui'

export const UL = styled(YStack, {
  render: 'ul',
  my: '2',
  pl: '6',
  style: {
    listStyleType: 'disc',
    listStylePosition: 'outside',
  },
})
