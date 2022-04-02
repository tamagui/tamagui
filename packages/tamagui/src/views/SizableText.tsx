import { GetProps, Text, styled } from '@tamagui/core'

import { sizableTextSizeVariant } from '../helpers/sizableTextSizeVariant'

export const SizableText = styled(Text, {
  name: 'SizableText',
  fontFamily: '$body',
  color: '$color',
  // TODO can we make it work using its own variants with types? likely not...
  // TODO if not then we need to add defaultVariants: {}
  // @ts-ignore
  size: '$4',

  variants: {
    size: {
      // TODO this should be ...fontSize type not working
      '...size': sizableTextSizeVariant,
    },
  },
})

export type SizableTextProps = GetProps<typeof SizableText>
