import { styled } from '@tamagui/web'
import { Input } from './Input'
import { defaultStyles, textAreaSizeVariant } from './shared'

export const TextArea = styled(Input, {
  name: 'TextArea',
  tag: 'textarea',

  // this attribute fixes firefox newline issue
  // @ts-ignore
  whiteSpace: 'pre-wrap',

  variants: {
    unstyled: {
      false: {
        height: 'auto',
        ...defaultStyles,
        numberOfLines: 3,
      },
    },

    size: {
      '...size': textAreaSizeVariant,
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})
