// Styled Input/TextArea = the unstyled @tamagui/ui Input/TextArea behavior
// primitives + the default v2-look skin (theme palette, border, background, font
// family, hover/focus color styling, and the size table), layered here in
// `tamagui`. The behavior primitives keep only structural resets. Single skin
// definition; the shadcn registry item is generated from this file.
import {
  createStyledHOC,
  type GetProps,
  isWeb,
  styled,
  Theme,
  type ThemeProps,
} from '@tamagui/core'
import { Input as UiInput, TextArea as UiTextArea } from '@tamagui/input'

export type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | boolean

const inputSize = {
  xs: { paddingInline: '2', paddingBlock: '1', borderRadius: 'sm', fontSize: 'xs' },
  sm: { paddingInline: '3', paddingBlock: '1.5', borderRadius: 'md', fontSize: 'sm' },
  md: { paddingInline: '4', paddingBlock: '2', borderRadius: 'md', fontSize: 'sm' },
  lg: { paddingInline: '6', paddingBlock: '2', borderRadius: 'md', fontSize: 'base' },
  xl: { paddingInline: '8', paddingBlock: '2.5', borderRadius: 'lg', fontSize: 'lg' },
} as const

const inputLineHeight = {
  xs: 'xs',
  sm: 'sm',
  md: 'sm',
  lg: 'base',
  xl: 'lg',
} as const

const resolveInputSize = (size: InputSize | undefined): keyof typeof inputSize =>
  typeof size === 'string' ? size : 'md'

// line height ships only on web: on native the platform default applies, so an
// input's height stays padding plus line height on both platforms
const resolveInputLineHeight = (props: { size?: InputSize; lineHeight?: unknown }) => {
  if (!isWeb || props.lineHeight != null) return
  const lineHeight = inputLineHeight[resolveInputSize(props.size)]
  if (lineHeight) return { lineHeight }
}

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
  variants: {
    size: {
      ...inputSize,
      true: inputSize.md,
    },
  } as const,
  defaultVariants: {
    size: 'md',
  },
}).resolve((props) => resolveInputLineHeight(props as any))

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
}).resolve((props) => resolveInputLineHeight(props as any))

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
