import React from 'react'
import { getSize, getSpace } from '@tamagui/get-token'
import type { GetProps, SizeTokens } from '@tamagui/web'
import {
  View,
  Text,
  createStyledContext,
  resolveDefaultSizeToken,
  styled,
  useTheme,
  withStaticProperties,
} from '@tamagui/web'

export const ButtonContext = createStyledContext({
  size: '$md' as SizeTokens,
})
export const ButtonFrame = styled(View, {
  name: 'Button',
  context: ButtonContext,
  backgroundColor: '$background',
  alignItems: 'center',
  flexDirection: 'row',

  // Here is the issue: <---------------------------------------------------
  height: 'auto',
  transition: 'bouncy',
  pressStyle: {
    scale: 0.97,
    opacity: 0.9,
  },

  variants: {
    size: {
      '...size': (name, { tokens }) => {
        const sizeToken = resolveDefaultSizeToken(name) as Exclude<SizeTokens, true>

        return {
          height: tokens.size[sizeToken],

          borderRadius: tokens.radius[sizeToken],

          // resolve tokens to numeric values and multiply to derive related
          // sizes - this is a stylistic choice that depends on your token scale

          gap: tokens.space[sizeToken].val * 0.2,

          paddingHorizontal: getSpace(sizeToken).val * 0.9,
        }
      },
    },
  } as const,

  defaultVariants: {
    size: '$5',
  },
})
type ButtonProps = GetProps<typeof ButtonFrame>
export const ButtonText = styled(Text, {
  name: 'ButtonText',
  context: ButtonContext,
  color: '$color',
  userSelect: 'none',
  variants: {
    size: {
      '...fontSize': (name, { font }) => {
        const sizeToken = resolveDefaultSizeToken(name) as Exclude<typeof name, true>

        return {
          fontSize: font?.size[sizeToken],
        }
      },
    },
  } as const,
})

const ButtonIcon = (props: { children: any }) => {
  const { size } = React.useContext(ButtonContext.context)

  const smaller = getSize(size).val * 0.4

  const theme = useTheme()

  return React.cloneElement(props.children, {
    size: smaller,
    color: theme.color.get(),
  })
}

const Button = withStaticProperties(ButtonFrame, {
  Props: ButtonContext.Provider,
  Text: ButtonText,
  Icon: ButtonIcon,
})

export const StyledButtonAnimationAuto = () => (
  <Button id="test">
    <Button.Text>test</Button.Text>
  </Button>
)
