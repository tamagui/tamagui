import { getButtonSized } from '@tamagui/get-button-sized'
import { GetProps, styled, withStaticProperties } from '@tamagui/web'
import { createContext, useContext } from 'react'

import { Button as HeadlessButton } from '../headless'

export const ButtonFrame = styled(HeadlessButton, {
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'nowrap',
  flexDirection: 'row',
  cursor: 'pointer',

  focusable: true,
  hoverTheme: true,
  pressTheme: true,
  backgrounded: true,
  borderWidth: 1,
  borderColor: 'transparent',

  pressStyle: {
    borderColor: 'transparent',
  },

  hoverStyle: {
    borderColor: 'transparent',
  },

  focusStyle: {
    borderColor: '$borderColorFocus',
  },

  variants: {
    size: {
      '...size': getButtonSized,
    },

    active: {
      true: {
        hoverStyle: {
          backgroundColor: '$background',
        },
      },
    },

    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },
  } as const,

  defaultVariants: {
    size: '$true',
  },
})

export type ButtonProps = GetProps<typeof Button>

interface ButtonStyleContextValue {
  size: Exclude<ButtonProps['size'], null | undefined>
}
const ButtonStyleContext = createContext<ButtonStyleContextValue | null>(null)
const useButtonStyleContext = () => {
  const context = useContext(ButtonStyleContext)
  if (!context)
    throw new Error('useButtonContext should be used within ButtonStyleContext')
  return context
}

export const ButtonTextFrame = styled(HeadlessButton.Text, {
  userSelect: 'none',
  cursor: 'pointer',
  // flexGrow 1 leads to inconsistent native style where text pushes to start of view
  flexGrow: 0,
  flexShrink: 1,
  ellipse: true,

  variants: {
    defaultStyle: {
      true: {
        color: '$color',
      },
    },
  },
})

export const ButtonText = ButtonTextFrame.extractable(
  (props: GetProps<typeof ButtonTextFrame>) => {
    const context = useButtonStyleContext()
    return (
      <ButtonTextFrame size={context.size} {...props}>
        {props.children}
      </ButtonTextFrame>
    )
  }
)
const ButtonComponent = ButtonFrame.extractable((props: GetProps<typeof ButtonFrame>) => {
  return (
    <ButtonStyleContext.Provider value={{ size: props.size ?? '$true' }}>
      <ButtonFrame {...props}>{props.children}</ButtonFrame>
    </ButtonStyleContext.Provider>
  )
})

export const Button = withStaticProperties(ButtonComponent, {
  Text: ButtonText,
})

export { useButton } from '../Button'
