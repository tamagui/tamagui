import { YStack, styled } from 'tamagui'

export const Section = styled(YStack, {
  name: 'Section',
  pos: 'relative',
  py: '$14',
  zi: 2,

  variants: {
    below: {
      true: {
        zi: 1,
      },
    },
  },
})
