// Styled Input/TextArea = the unstyled @tamagui/ui Input/TextArea behavior
// primitives + the default v2-look skin (theme palette, border, background, font
// family, hover/focus color styling, and the size table), layered here in
// `tamagui`. The behavior primitives keep only structural resets. Single skin
// definition; the shadcn registry item is generated from this file.
import {
  type ComponentSize,
  createStyledHOC,
  type GetProps,
  isWeb,
  styled,
  Theme,
  type ThemeProps,
} from '@tamagui/core'
import { Input as UiInput, TextArea as UiTextArea } from '@tamagui/input'

export type InputSize = ComponentSize | boolean

const inputSize = {
  xs: {
    paddingInline: '2',
    paddingBlock: '1',
    borderRadius: 'sm',
    fontSize: 'xs',
    lineHeight: isWeb ? 'xs' : undefined,
  },
  sm: {
    paddingInline: '3',
    paddingBlock: '1.5',
    borderRadius: 'md',
    fontSize: 'sm',
    lineHeight: isWeb ? 'sm' : undefined,
  },
  md: {
    paddingInline: '4',
    paddingBlock: '2',
    borderRadius: 'md',
    fontSize: 'sm',
    lineHeight: isWeb ? 'sm' : undefined,
  },
  lg: {
    paddingInline: '6',
    paddingBlock: '2',
    borderRadius: 'md',
    fontSize: 'base',
    lineHeight: isWeb ? 'base' : undefined,
  },
  xl: {
    paddingInline: '8',
    paddingBlock: '2.5',
    borderRadius: 'lg',
    fontSize: 'lg',
    lineHeight: isWeb ? 'lg' : undefined,
  },
} as const

const inputSkin = {
  fontFamily: 'body',
  lineHeight: isWeb ? 'sm' : undefined,
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
  variants: {
    size: {
      ...inputSize,
      true: inputSize.md,
    },
  } as const,
  defaultVariants: {
    size: 'md',
  },
})

const TextAreaFrame = styled(UiTextArea, {
  displayName: 'TextArea',
  className: 'is_TextArea',
  ...inputSkin,
  variants: {
    size: {
      ...inputSize,
      true: inputSize.md,
    },
  } as const,
  defaultVariants: {
    size: 'md',
  },
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
