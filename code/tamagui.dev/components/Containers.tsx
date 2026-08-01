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
  px: '4 gtSm:6',
  width: '100%',
  position: 'relative',
  maxW: 'gtSm:760px gtMd:810px gtLg:810px',
  variants,
})

export const ContainerLarge = styled(YStack, {
  mx: 'auto',
  px: '4',
  width: '100%',
  position: 'relative',
  maxW: 'gtSm:980px gtMd:1140px',
  variants,
})

export const ContainerXL = styled(YStack, {
  mx: 'auto',
  width: '100%',
  position: 'relative',
  px: 'gtSm:4',
  maxW: 'gtSm:980px gtMd:1240px gtLg:1440px',
  variants,
})

export const ContainerBento = styled(YStack, {
  mx: 'auto',
  width: '100%',
  position: 'relative',
  px: 'gtSm:4',
  maxW: 'gtSm:980px gtMd:1180px gtXl:1300px',
  z: 100,
  variants,
})
