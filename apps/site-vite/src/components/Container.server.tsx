// debug
// 123
import { YStack, styled } from 'tamagui'

export const Container = styled(YStack, {
  mx: 'auto',
  px: '$4',
  width: '100%',

  $gtSm: {
    maxWidth: 700,
    pr: '$2',
  },

  $gtMd: {
    maxWidth: 760,
    pr: '$2',
  },

  $gtLg: {
    maxWidth: 760,
    pr: '$10',
  },
})

export const ContainerLarge = styled(YStack, {
  mx: 'auto',
  px: '$4',
  width: '100%',

  $gtSm: {
    maxWidth: 980,
  },

  $gtMd: {
    maxWidth: 1140,
  },
})

export const ContainerXL = styled(YStack, {
  mx: 'auto',
  px: '$4',
  width: '100%',

  $gtSm: {
    maxWidth: 980,
  },

  $gtMd: {
    maxWidth: 1240,
  },

  $gtLg: {
    maxWidth: 1440,
  },
})
