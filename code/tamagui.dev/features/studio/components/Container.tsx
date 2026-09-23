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
  pr: '4 md:1-5 lg:1-5 xl:14',
  width: '100%',
  maxW: 'md:700px lg:740px xl:800px',
  variants,
})

export const ContainerLarge = styled(YStack, {
  mx: 'auto',
  px: '4',
  width: '100%',
  maxW: 'md:980px lg:1140px',
  variants,
})

export const ContainerXL = styled(YStack, {
  mx: 'auto',
  px: '4',
  width: '100%',
  maxW: 'md:980px lg:1240px xl:1440px',
  variants,
})
