import { YStack, styled } from 'tamagui'

export const OffsetBox = styled(YStack, {
  name: 'OffsetBox',
  variants: {
    size: {
      hero: {
        mx: 'gtSm:-2 gtMd:-4 gtLg:-6',
      },
    },
  } as const,
})
