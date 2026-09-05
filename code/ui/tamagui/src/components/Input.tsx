// Styled Input/TextArea = the unstyled @tamagui/ui Input/TextArea behavior
// primitives + the default v2-look skin (theme palette, border, background, font
// family, hover/focus color styling), layered here in `tamagui`. The behavior
// primitives keep only structural sizing + the native outline reset. Single skin
// definition; the shadcn registry item is generated from this file.
import {
  createStyledHOC,
  type GetProps,
  Input as UiInput,
  styled,
  TextArea as UiTextArea,
  Theme,
  type ThemeProps,
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

const InputFrame = styled(UiInput, {
  displayName: 'Input',
  className: 'is_Input',
  ...inputSkin,
})

const TextAreaFrame = styled(UiTextArea, {
  displayName: 'TextArea',
  className: 'is_TextArea',
  ...inputSkin,
})

export const Input = createStyledHOC(
  InputFrame,
  function Input({ theme, ...props }, ref) {
    const input = (
      <Theme name="Input">
        <InputFrame ref={ref} {...props} />
      </Theme>
    )
    return theme ? <Theme name={theme as ThemeProps['name']}>{input}</Theme> : input
  },
  { disableTheme: true }
)

export const TextArea = createStyledHOC(
  TextAreaFrame,
  function TextArea({ theme, ...props }, ref) {
    const textArea = (
      <Theme name="TextArea">
        <TextAreaFrame ref={ref} {...props} />
      </Theme>
    )
    return theme ? <Theme name={theme as ThemeProps['name']}>{textArea}</Theme> : textArea
  },
  { disableTheme: true }
)

export type InputProps = GetProps<typeof Input>
export type TextAreaProps = GetProps<typeof TextArea>
