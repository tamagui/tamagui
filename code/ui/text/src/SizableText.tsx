import { getFontSized } from '@tamagui/get-font-sized'
import type { GetProps } from '@tamagui/web'
import { Text, styled } from '@tamagui/web'

export const SizableText = styled(Text, {
  name: 'SizableText',
  fontFamily: '$body',
  size: true,
  color: '$color',

  variants: {
    size: getFontSized,
  },
})

SizableText.staticConfig.inlineProps = new Set([
  ...(SizableText.staticConfig.inlineProps || []),
  'maxFontSizeMultiplier',
])

// we are doing weird stuff to avoid bad types
// TODO make this just work
SizableText.staticConfig.variants!.fontFamily = {
  any: (val, extras) => {
    // pass through inherit directly without font variant expansion
    if (val === 'inherit') {
      return { fontFamily: 'inherit' }
    }

    const sizeProp = extras.props['size']
    const fontSizeProp = extras.props['fontSize']
    const size =
      sizeProp === true && fontSizeProp ? fontSizeProp : (extras.props['size'] ?? true)
    return getFontSized(size, extras)
  },
}

export type SizableTextProps = GetProps<typeof SizableText>
