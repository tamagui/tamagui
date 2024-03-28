import { getFontSized } from '@tamagui/get-font-sized'
import type { GetProps } from '@tamagui/web'
import { Text, styled } from '@tamagui/web'

export const SizableText = styled(Text, {
  name: 'SizableText',
  fontFamily: '$body',

  variants: {
    unstyled: {
      false: {
        size: '$true',
        color: '$color',
      },
    },

    size: getFontSized,

    fontFamily: {
      '...': (_, extras) => {
        const size = extras.props['size'] || '$true'
        return getFontSized(size, extras)
      },
    } as any,
  },

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})

export type SizableTextProps = GetProps<typeof SizableText>
