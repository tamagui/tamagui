import { GetProps, Text, getFont, styled } from '@tamagui/core'

export const SizableText = styled(
  Text,
  {
    name: 'SizableText',
    fontFamily: '$body',

    variants: {
      size: getFont,
    },

    defaultVariants: {
      size: '$4',
    },
  },
  {
    inlineWhenUnflattened: new Set(['fontFamily']),
  }
)

export type SizableTextProps = GetProps<typeof SizableText>
