import { YStack, styled } from 'tamagui'

export const OffsetBox = styled(YStack, {
  displayName: 'OffsetBox',
  variants: {
    size: {
      hero: {
        mx: 'md:-1-5 lg:-4 xl:-8',
      },
    },
  } as const,
})
