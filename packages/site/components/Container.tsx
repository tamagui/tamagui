import { YStack, styled } from 'tamagui'

export const Container = styled(YStack, {
  mx: 'auto',
  px: '$4',
  width: '100%',

  $gtSm: {
    maxWidth: 700,
  },

  $gtMd: {
    maxWidth: 700,
  },
})

export const ContainerLarge = styled(YStack, {
  mx: 'auto',
  px: '$4',
  width: '100%',

  $gtSm: {
    maxWidth: 960,
  },

  $gtMd: {
    maxWidth: 1040,
  },
})
