import { GetProps, Text, styled } from '@tamagui/core'

import { sizableTextSizeVariant } from '../helpers/sizableTextSizeVariant'

export const SizableText = styled(Text, {
  name: 'SizableText',
  fontFamily: '$body',
  color: '$color',
  // @ts-ignore
  size: '$4',

  variants: {
    size: {
      '...fontSize': sizableTextSizeVariant,
    },
  },
})

export type SizableTextProps = GetProps<typeof SizableText>
