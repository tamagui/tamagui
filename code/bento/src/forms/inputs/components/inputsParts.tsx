import { forwardRef, useState } from 'react'
import { type ComponentSize, resolveSizing } from '@tamagui/core'
import type { ColorTokens, TamaguiElement, YStackProps } from 'tamagui'
import {
  Label,
  Button as TButton,
  Text,
  View,
  XGroup,
  createStyledContext,
  createStyledHOC,
  getVariable,
  isWeb,
  styled,
  useGetThemedIcon,
  useTheme,
  withStaticProperties,
} from 'tamagui'
import { Input as TInput } from 'tamagui/unstyled'
import { tone } from '../../../tone'

export const InputContext = createStyledContext<{
  size: ComponentSize
  scaleIcon: number
  color?: ColorTokens | string
}>({
  size: 'md',
  scaleIcon: 1,
  color: undefined,
})

const radiusForSize = styled.dynamic<ComponentSize>((val, env) => {
  const sizing = resolveSizing(val, env)
  if (!sizing) return
  return { borderRadius: sizing.radius }
})

const InputGroupFrame = styled(XGroup, {
  justify: 'space-between',
  context: InputContext,
  borderWidth: 1,
  tabIndex: 0,
  borderColor: `${tone.border} hover:color-6 focus:color-8`,
  backgroundColor: tone.field,
  // this fixes a flex bug where it overflows container
  minWidth: 0,
  outlineColor: 'focus:outline-color',
  outlineWidth: '0 focus:2px',
  outlineStyle: 'focus:solid',
  variants: {
    scaleIcon: styled.dynamic<number>(),
    applyFocusStyle: {
      true: {
        outlineColor: 'outline-color',
        outlineWidth: 2,
        outlineStyle: 'solid',
        borderColor: 'color-8',
      },
    },
    size: radiusForSize,
  } as const,
})

const FocusContext = createStyledContext({
  setFocused: (val: boolean) => {},
  focused: false,
})

const InputBox = createStyledHOC(InputGroupFrame, (props, forwardedRef) => {
  const { children, ...rest } = props
  const [focused, setFocused] = useState(false)

  return (
    <FocusContext.Provider focused={focused} setFocused={setFocused}>
      <InputGroupFrame applyFocusStyle={focused} ref={forwardedRef} {...rest}>
        {children}
      </InputGroupFrame>
    </FocusContext.Provider>
  )
})

const InputFrame = styled(TInput, {
  context: InputContext,
  color: 'color',
  placeholderTextColor: tone.muted,
  fontFamily: 'body',
  variants: {
    scaleIcon: styled.dynamic<number>(),
    size: styled.dynamic<ComponentSize>((val, env) => {
      const sizing = resolveSizing(val, env)
      if (!sizing) return
      return {
        height: sizing.height,
        fontSize: sizing.fontSize,
        // lineHeight messes up input on native
        ...(isWeb && { lineHeight: sizing.lineHeight }),
        paddingInline: sizing.paddingInline,
      }
    }),
  } as const,
})

const InputArea = createStyledHOC(
  InputFrame,
  (
    props: React.ComponentProps<typeof InputFrame> & {
      secureTextEntry?: boolean
      keyboardType?: string
      textContentType?: string
      onChangeText?: (text: string) => void
      onLayout?: (event: any) => void
    },
    ref
  ) => {
    const { setFocused } = FocusContext.useStyledContext()
    const {
      secureTextEntry,
      keyboardType,
      textContentType,
      onChangeText,
      onLayout,
      ...rest
    } = props
    return (
      <View flex={1} onLayout={onLayout}>
        <InputFrame
          ref={ref}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          type={secureTextEntry ? 'password' : rest.type}
          inputMode={
            keyboardType === 'numeric'
              ? 'numeric'
              : keyboardType === 'email-address'
                ? 'email'
                : undefined
          }
          autoComplete={
            textContentType === 'emailAddress'
              ? 'email'
              : textContentType === 'password'
                ? 'current-password'
                : undefined
          }
          onChange={
            onChangeText
              ? (e: any) => onChangeText(e.target?.value ?? e.nativeEvent?.text ?? '')
              : undefined
          }
          {...rest}
        />
      </View>
    )
  }
)

const InputSection = styled(XGroup.Item, {
  justify: 'center',
  items: 'center',
  context: InputContext,
  variants: {
    scaleIcon: styled.dynamic<number>(),
  } as const,
})

const Button = styled(TButton, {
  context: InputContext,
  justify: 'center',
  items: 'center',
  variants: {
    scaleIcon: styled.dynamic<number>(),
    size: styled.dynamic<ComponentSize>((val, env) => {
      const sizing = resolveSizing(val, env)
      if (!sizing) return
      return {
        paddingInline: 0,
        height: sizing.height,
        borderRadius: sizing.radius,
      }
    }),
  } as const,
})

export const InputIconFrame = styled(View, {
  justify: 'center',
  items: 'center',
  context: InputContext,
  variants: {
    scaleIcon: styled.dynamic<number>(),
    size: styled.dynamic<ComponentSize>((val, env) => {
      const sizing = resolveSizing(val, env)
      if (!sizing) return
      return { paddingInline: sizing.paddingBlock }
    }),
  } as const,
})

const InputIcon = createStyledHOC(
  InputIconFrame,
  (
    props: React.PropsWithChildren<{
      scaleIcon?: number
      color?: ColorTokens | string
    }>,
    ref
  ) => {
    const { children, color: colorProp, ...rest } = props
    const { size, color: contextColor, scaleIcon } = InputContext.useStyledContext()
    const theme = useTheme()
    const color = getVariable(
      colorProp ||
        contextColor ||
        theme[contextColor as any]?.get('web') ||
        theme['color-9']?.get('web')
    )
    const getThemedIcon = useGetThemedIcon({
      size: resolveSizing(size).icon * scaleIcon,
      color: color as any,
    })
    return (
      <InputIconFrame ref={ref} {...rest}>
        {getThemedIcon(children)}
      </InputIconFrame>
    )
  }
)

type InputContainerProps = React.PropsWithChildren<
  Pick<
    YStackProps,
    | 'cursor'
    | 'flex'
    | 'flexBasis'
    | 'minW'
    | 'mx'
    | 'onBlur'
    | 'onPress'
    | 'style'
    | 'theme'
  > & {
    color?: ColorTokens | string
    scaleIcon?: number
    size?: ComponentSize
  }
>

const InputContainerFrame = styled(View, {
  flexDirection: 'column',
  variants: {
    size: styled.dynamic<ComponentSize>((val, env) => {
      const sizing = resolveSizing(val, env)
      if (!sizing) return
      return { gap: sizing.gap }
    }),
  } as const,
})

const InputContainer = forwardRef<TamaguiElement, InputContainerProps>(
  ({ children, color, scaleIcon = 1, size = 'md', ...props }, ref) => (
    <InputContext.Provider color={color} scaleIcon={scaleIcon} size={size}>
      <InputContainerFrame ref={ref} size={size} {...props}>
        {children}
      </InputContainerFrame>
    </InputContext.Provider>
  )
)

export const InputLabel = styled(Label, {
  context: InputContext,
  variants: {
    scaleIcon: styled.dynamic<number>(),
    size: styled.dynamic<ComponentSize>((val, env) => {
      const sizing = resolveSizing(val, env)
      if (!sizing) return
      return { fontSize: sizing.fontSize, lineHeight: sizing.lineHeight }
    }),
  } as const,
})

// help and error text sit one step below the field's text
const infoFontSize = { xs: 'xs', sm: 'xs', md: 'xs', lg: 'sm', xl: 'base' } as const

export const InputInfo = styled(Text, {
  context: InputContext,
  color: tone.muted,
  fontFamily: 'body',
  variants: {
    scaleIcon: styled.dynamic<number>(),
    size: styled.dynamic<ComponentSize>((val) => {
      const fontSize = infoFontSize[val as keyof typeof infoFontSize] ?? 'xs'
      return { fontSize, lineHeight: fontSize }
    }),
  } as const,
})

const InputXGroup = styled(XGroup, {
  context: InputContext,
  variants: {
    scaleIcon: styled.dynamic<number>(),
    size: radiusForSize,
  } as const,
})

export const Input = withStaticProperties(InputContainer, {
  Box: InputBox,
  Area: InputArea,
  Section: InputSection,
  Button,
  Icon: InputIcon,
  Info: InputInfo,
  Label: InputLabel,
  XGroup: withStaticProperties(InputXGroup, { Item: XGroup.Item }),
})
