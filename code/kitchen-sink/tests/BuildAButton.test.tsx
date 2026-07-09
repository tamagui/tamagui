import { getSize, getSpace } from '@tamagui/get-token'
import type { SizeTokens } from '@tamagui/web'
import {
  GetProps,
  View,
  Text,
  createStyledContext,
  resolveDefaultSizeToken,
  styled,
  useTheme,
  withStaticProperties,
} from '@tamagui/web'
import { cloneElement, useContext } from 'react'

export const ButtonContext = createStyledContext({
  size: '$md' as SizeTokens,
})

export const ButtonFrame = styled(View, {
  name: 'Button',
  context: ButtonContext,
  backgroundColor: '$background',
  alignItems: 'center',
  flexDirection: 'row',

  hoverStyle: {
    backgroundColor: '$backgroundHover',
  },

  pressStyle: {
    backgroundColor: '$backgroundPress',
  },

  variants: {
    size: {
      '...size': (name, { tokens }) => {
        const sizeToken = resolveDefaultSizeToken(name) as Exclude<SizeTokens, true>

        return {
          height: tokens.size[sizeToken],
          borderRadius: tokens.radius[sizeToken],
          // note the getSpace and getSize helpers will let you shift down/up token sizes
          // whereas with gap we just multiply by 0.2
          // this is a stylistic choice, and depends on your design system values
          gap: tokens.space[sizeToken].val * 0.2,
          paddingHorizontal: getSpace(sizeToken, {
            shift: -1,
          }),
        }
      },
    },
  } as const,

  defaultVariants: {
    size: '$true',
  },
})

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
  const { size } = useContext(ButtonContext.context)
  const smaller = getSize(size, {
    shift: -2,
  })
  const theme = useTheme()
  return cloneElement(props.children, {
    size: smaller.val * 0.5,
    color: theme.color.get(),
  })
}

export const Button = withStaticProperties(ButtonFrame, {
  Props: ButtonContext.Provider,
  Text: ButtonText,
  Icon: ButtonIcon,
})
