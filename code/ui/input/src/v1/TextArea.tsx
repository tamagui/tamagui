import { styled } from '@tamagui/web'
import { Input } from './Input'
import { defaultStyles, textAreaSizeVariant } from '../shared'

/**
 * @deprecated Use the new TextArea from '@tamagui/input' instead
 * @summary A text area is a multi-line input field that allows users to enter text.
 * @see — Docs https://tamagui.dev/ui/inputs#textarea
 */
export const TextArea = styled(Input, {
  name: 'TextArea',
  render: 'textarea',

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
