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
  },

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

// we are doing weird stuff to avoid bad types
// TODO make this just work
SizableText.staticConfig.variants!.fontFamily = {
  '...': (_val, extras) => {
    const sizeProp = extras.props['size']
    const fontSizeProp = extras.props['fontSize']
    const size =
      sizeProp === '$true' && fontSizeProp
        ? fontSizeProp
        : extras.props['size'] || '$true'
    return getFontSized(size, extras)
  },
}

export type SizableTextProps = GetProps<typeof SizableText>
