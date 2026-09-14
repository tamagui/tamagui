import { type GetProps, styled } from '@tamagui/web'
import { Input } from './Input'
import { defaultStyles, resolveTextAreaSize, textAreaSizeVariant } from './shared'

/**
 * A web-aligned textarea component (multi-line input).
 * @see — Docs https://tamagui.dev/ui/inputs#textarea
 */
const TextAreaFrame = styled(Input, {
  displayName: 'TextArea',
  render: 'textarea',

  // this attribute fixes firefox newline issue
  // @ts-ignore
  whiteSpace: 'pre-wrap',
  height: 'auto',
  ...defaultStyles,
  rows: 3,

  variants: {
    size: textAreaSizeVariant,
  } as const,
})

export const TextArea = TextAreaFrame.resolve(resolveTextAreaSize)

export type TextAreaProps = GetProps<typeof TextArea>
