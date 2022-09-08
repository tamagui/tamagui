import { YStack, styled } from 'tamagui'

export const OffsetBox = styled(YStack, {
  name: 'OffsetBox',
  variants: {
    size: {
      hero: {
        $gtSm: { mx: '$-2' },
        $gtMd: { mx: '$-4' },
        $gtLg: { mx: '$-6' },
      },
    },
  } as const,
})
