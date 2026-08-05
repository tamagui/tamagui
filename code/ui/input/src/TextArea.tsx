import { type GetProps, styled } from '@tamagui/web'
import { Input } from './Input'
import { defaultStyles, textAreaSizeVariant } from './shared'

/**
 * A web-aligned textarea component (multi-line input).
 * @see — Docs https://tamagui.dev/ui/inputs#textarea
 */
export const TextArea = styled(Input, {
  name: 'TextArea',
  render: 'textarea',

  // this attribute fixes firefox newline issue
  // @ts-ignore
  whiteSpace: 'pre-wrap',
  height: 'auto',
  ...defaultStyles,
  rows: 3,

  variants: {
    size: {
      true: textAreaSizeVariant,
      Size: textAreaSizeVariant,
    },
  } as const,
})

export type TextAreaProps = GetProps<typeof TextArea>
