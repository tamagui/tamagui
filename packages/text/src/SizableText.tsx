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

    // this is a bit odd but we need it because otherwise if a parent sets
    // a new fontFamily it wont go through size variant unless size also set
    fontFamily: {
      '...': (_, extras) => {
        const size = extras.props['size'] || '$true'
        return getFontSized(size, extras)
      },
    },
  } as const,

  defaultVariants: {
    unstyled: false,
  },
})

export type SizableTextProps = GetProps<typeof SizableText>
