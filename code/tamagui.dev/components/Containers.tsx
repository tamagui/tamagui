import { YStack, styled } from 'tamagui'

const variants = {
  hide: {
    true: {
      pointerEvents: 'none',
      opacity: 0,
    },
  },
} as const

export const Container = styled(YStack, {
  mx: 'auto',
  px: '$4',
  width: '100%',
  position: 'relative',

  $gtSm: {
    maxW: 760,
    pr: '$2',
  },

  $gtMd: {
    maxW: 810,
    pr: '$8',
    ml: '$4',
  },

  $gtLg: {
    maxW: 810,
    pr: '$10',
  },

  variants,
})

export const ContainerLarge = styled(YStack, {
  mx: 'auto',
  px: '$4',
  width: '100%',
  position: 'relative',

  $gtSm: {
    maxW: 980,
  },

  $gtMd: {
    maxW: 1140,
  },

  variants,
})

export const ContainerXL = styled(YStack, {
  mx: 'auto',
  width: '100%',
  position: 'relative',

  $gtSm: {
    px: '$4',
    maxW: 980,
  },

  $gtMd: {
    maxW: 1240,
  },

  $gtLg: {
    maxW: 1440,
  },

  variants,
})

export const ContainerBento = styled(YStack, {
  mx: 'auto',
  width: '100%',
  position: 'relative',

  $gtSm: {
    px: '$4',
    maxW: 980,
  },

  $gtMd: {
    maxW: 1180,
  },

  $gtXl: {
    maxW: 1300,
  },

  variants,

  z: 100,
})
