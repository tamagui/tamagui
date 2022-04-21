import { YStack, styled } from 'tamagui'

export const OffsetBox = styled(YStack, {
  name: 'OffsetBox',
  variants: {
    size: {
      hero: {
        $gtSm: { mx: '$-5' },
        $gtMd: { mx: '$-10' },
      },
    },
  },
})
