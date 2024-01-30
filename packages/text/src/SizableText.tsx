import { getFontSized } from '@tamagui/get-font-sized'
import type { GetProps } from '@tamagui/web'
import { Text, styled } from '@tamagui/web'

const variants = {
  unstyled: {
    false: {
      size: '$true',
      color: '$color',
    },
  },

  size: getFontSized,
} as const

// this is odd but we need it because otherwise if a parent sets
// a new fontFamily it wont go through size variant unless size also set
// and its messing up types due to overlap with style prop so doing super odd stuff
variants['fontFamily'] = {
  '...': (_, extras) => {
    const size = extras.props['size'] || '$true'
    return getFontSized(size, extras)
  },
}

export const SizableText = styled(Text, {
  name: 'SizableText',
  fontFamily: '$body',

  variants,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})

export type SizableTextProps = GetProps<typeof SizableText>
