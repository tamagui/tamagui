import { getFontSized } from '@tamagui/get-font-sized'
import { GetProps, Text, styled } from '@tamagui/web'

export const SizableText = styled(Text, {
  name: 'SizableText',
  fontFamily: '$body',

  variants: {
    unstyled: {
      false: {
        size: '$true',
      },
    },

    size: getFontSized,
  } as const,

  defaultVariants: {
    unstyled: false,
  },
})

export type SizableTextProps = GetProps<typeof SizableText>
