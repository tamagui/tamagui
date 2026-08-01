// Styled Input/TextArea = the unstyled @tamagui/ui Input/TextArea behavior
// primitives + the default v2-look skin (theme palette, border, background, font
// family, hover/focus color styling), layered here in `tamagui`. The behavior
// primitives keep only structural sizing + the native outline reset. Single skin
// definition; the shadcn registry item is generated from this file.
import {
  type GetProps,
  Input as UiInput,
  styled,
  TextArea as UiTextArea,
} from '@tamagui/ui'

const inputSkin = {
  fontFamily: 'body',
  color: 'color',
  backgroundColor: 'background',
  borderColor: 'border-color hover:border-color-hover focus:border-color-focus',
  borderWidth: 1,
  outlineColor: 'focus-visible:outline-color',
  outlineWidth: 'focus-visible:2px',
  outlineStyle: 'focus-visible:solid',
} as const

export const Input = styled(UiInput, {
  name: 'Input',
  ...inputSkin,
})

export const TextArea = styled(UiTextArea, {
  name: 'TextArea',
  ...inputSkin,
})

export type InputProps = GetProps<typeof Input>
export type TextAreaProps = GetProps<typeof TextArea>
