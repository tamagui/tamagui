import { GetProps, Text, getTextSize, styled } from '@tamagui/core'

export const SizableText = styled(Text, {
  name: 'SizableText',
  fontFamily: '$body',

  variants: {
    size: getTextSize,
  },

  defaultVariants: {
    size: '$4',
  },
})

export type SizableTextProps = GetProps<typeof SizableText>
