import { GetProps, Text, styled } from '@tamagui/core'

import { sizableTextSizeVariant } from '../helpers/sizableTextSizeVariant'

export const SizableText = styled(Text, {
  name: 'SizableText',
  fontFamily: '$body',

  variants: {
    size: sizableTextSizeVariant,
  },

  defaultVariants: {
    size: '$4',
  },
})

export type SizableTextProps = GetProps<typeof SizableText>
