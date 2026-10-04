import { XGroup } from '../../../BentoSkins'
import { getFontSized } from '@tamagui/get-font-sized'
import { getSpace } from '@tamagui/get-token'
import type { SizeVariantSpreadFunction } from '@tamagui/web'
import { forwardRef, useState } from 'react'
import type { ColorTokens, FontSizeTokens, TamaguiElement, YStackProps } from 'tamagui'
import {
  createStyledHOC,
  Label,
  Button as TButton,
  Text,
  View,
  createStyledContext,
  getFontSize,
  getVariable,
  getVariableValue,
  isWeb,
  styled,
  useGetThemedIcon,
  useTheme,
  withStaticProperties,
} from 'tamagui'
import { Input as TInput } from 'tamagui/unstyled'

const defaultContextValues = {
  size: '4',
  scaleIcon: 1.2,
  color: undefined,
} as const

export const InputContext = createStyledContext<{
  size: FontSizeTokens
  scaleIcon: number
  color?: ColorTokens | string
}>(defaultContextValues)

export const defaultInputGroupStyles = {
  size: '4',
  fontFamily: 'body',
  borderWidth: 1,
  color: 'color',

  tabIndex: 0,

  borderColor: 'border-color hover:border-color-hover focus:border-color-focus',
  backgroundColor: 'color-2',

  // this fixes a flex bug where it overflows container
  minWidth: 0,

  outlineColor: 'focus:outline-color',
  outlineWidth: '0 focus:2px',
  outlineStyle: 'focus:solid',
} as const

const InputGroupFrame = styled(XGroup, {
  justify: 'space-between',
  context: InputContext,
  variants: {
    framed: {
      true: defaultInputGroupStyles,
    },
    scaleIcon: {
      number: () => ({}),
    },
    applyFocusStyle: {
      boolean: (val) => {
        if (val) {
          return {
            outlineColor: 'outline-color',
            outlineWidth: 2,
            outlineStyle: 'solid',
            borderColor: 'border-color-focus',
          }
        }
      },
    },
    size: {
      Size: (val, { tokens }) => {
        return {
          borderRadius: tokens.radius[val],
        }
      },
    },
  } as const,
  defaultVariants: {
    framed: true,
  },
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

export const inputSizeVariant: SizeVariantSpreadFunction<any> = (val = '4', extras) => {
  const size = val === true ? '4' : val
  const radiusToken = extras.tokens.radius[size] ?? extras.tokens.radius['4']
  const paddingHorizontal = getVariableValue(getSpace(size)) * 0.6
  const fontStyle = getFontSized(size as any, extras)
  // lineHeight messes up input on native
  if (!isWeb && fontStyle) {
    delete fontStyle['lineHeight']
  }
  return {
    ...fontStyle,
    height: size,
    borderRadius: extras.props.circular ? 100_000 : radiusToken,
    paddingHorizontal,
  }
}

const InputFrame = styled(TInput, {
  context: InputContext,
  variants: {
    scaleIcon: {
      number: () => ({}),
    },
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
    const { size } = InputContext.useStyledContext()
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
          onFocus={() => {
            setFocused(true)
          }}
          onBlur={() => setFocused(false)}
          size={size}
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
    scaleIcon: {
      number: () => ({}),
    },
  } as const,
})

const Button = styled(TButton, {
  context: InputContext,
  justify: 'center',
  items: 'center',

  variants: {
    scaleIcon: {
      number: () => ({}),
    },
    size: {
      Size: (val = '4', { tokens }) => {
        if (typeof val === 'number') {
          return {
            paddingHorizontal: 0,
            height: val,
            borderRadius: val * 0.2,
          }
        }
        return {
          paddingHorizontal: 0,
          height: val,
          borderRadius: tokens.radius[val],
        }
      },
    },
  } as const,
})

// Icon starts

export const InputIconFrame = styled(View, {
  justify: 'center',
  items: 'center',
  context: InputContext,

  variants: {
    scaleIcon: {
      number: () => ({}),
    },
    size: {
      Size: (val, { tokens }) => {
        return {
          paddingHorizontal: tokens.space[val],
        }
      },
    },
  } as const,
})

const getIconSize = (size: FontSizeTokens, scale: number) => {
  return (
    (typeof size === 'number' ? size * 0.5 : getFontSize(size as FontSizeTokens)) * scale
  )
}

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
    const inputContext = InputContext.useStyledContext()
    const { size = '4', color: contextColor, scaleIcon = 1 } = inputContext

    const theme = useTheme()
    const color = getVariable(
      contextColor || theme[contextColor as any]?.get('web') || theme['color-9']?.get('web')
    )
    const iconSize = getIconSize(size as FontSizeTokens, scaleIcon)

    const getThemedIcon = useGetThemedIcon({
      size: iconSize,
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
    size?: FontSizeTokens
  }
>

const InputContainer = forwardRef<TamaguiElement, InputContainerProps>(
  ({ children, color, scaleIcon = 1.2, size = '4', ...props }, ref) => (
    <InputContext.Provider color={color} scaleIcon={scaleIcon} size={size}>
      <View
        ref={ref}
        flexDirection="column"
        gap={getVariableValue(getSpace(size)) * 0.3}
        {...props}
      >
        {children}
      </View>
    </InputContext.Provider>
  )
)

export const InputLabel = styled(Label, {
  context: InputContext,
  variants: {
    scaleIcon: {
      number: () => ({}),
    },
    size: {
      FontSize: (val, extras) =>
        // getFontSized keeps an invariant TextProps generic despite this Label-compatible context.
        getFontSized(val, extras as Parameters<typeof getFontSized>[1]),
    },
  } as const,
})

export const InputInfo = styled(Text, {
  context: InputContext,
  color: 'color-9',
  variants: {
    scaleIcon: {
      number: () => ({}),
    },
    size: {
      FontSize: (val, { font }) => {
        if (!font) return
        const fontSize = font.size[val].val * 0.8
        const lineHeight = font.lineHeight?.[val].val * 0.8
        const fontWeight = font.weight?.['2']
        const letterSpacing = font.letterSpacing?.[val]
        const textTransform = font.transform?.[val]
        const fontStyle = font.style?.[val]
        return {
          fontSize,
          lineHeight,
          fontWeight,
          letterSpacing,
          textTransform,
          fontStyle,
        }
      },
    },
  } as const,
})

const InputXGroup = styled(XGroup, {
  context: InputContext,

  variants: {
    scaleIcon: {
      number: () => ({}),
    },
    size: {
      Size: (val, { tokens }) => {
        const radiusToken = tokens.radius[val] ?? tokens.radius['4']
        return {
          borderRadius: radiusToken,
        }
      },
    },
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
