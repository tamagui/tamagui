// via site

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
  paddingLeft: '4',
  pr: '4 gtSm:2 gtMd:2 gtLg:10',
  width: '100%',
  maxW: 'gtSm:700px gtMd:740px gtLg:800px',
  variants,
})

export const ContainerLarge = styled(YStack, {
  mx: 'auto',
  px: '4',
  width: '100%',
  maxW: 'gtSm:980px gtMd:1140px',
  variants,
})

export const ContainerXL = styled(YStack, {
  mx: 'auto',
  px: '4',
  width: '100%',
  maxW: 'gtSm:980px gtMd:1240px gtLg:1440px',
  variants,
})
