// debug
import React from 'react'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { spacedChildren } from '../helpers/spacedChildren'
import { useTheme } from '../hooks/useTheme'
import { HStack, StackProps } from './Stacks'
import { Text, TextProps } from './Text'

export type ButtonProps = StackProps & {
  textProps?: Omit<TextProps, 'children'>
  icon?: JSX.Element
}

// TODO colors, spacing, static extract + colors/spacing
// TODO sizing, static + sizing
// TODO auto-chain

export const Button = ({
  children,
  icon,
  spacing = 'sm',
  flexDirection = 'row',
  textProps,
  ...props
}: ButtonProps) => {
  const theme = useTheme()
  const contents = !children ? null : textProps ? (
    <Text color={theme.color} width="100%" ellipse {...textProps}>
      {children}
    </Text>
  ) : (
    <Text color={theme.color} width="100%" ellipse>
      {children}
    </Text>
  )
  return (
    <HStack
      backgroundColor={theme.backgroundColorSecondary}
      alignSelf="flex-start"
      justifyContent="center"
      alignItems="center"
      cursor="pointer"
      paddingVertical={10}
      paddingHorizontal={14}
      borderRadius={8}
      hoverStyle={{
        backgroundColor: theme.backgroundColorTertiary,
      }}
      pressStyle={{
        backgroundColor: theme.backgroundColorTertiary,
        transform: [{ scale: 0.96 }],
      }}
      flexDirection={flexDirection}
      {...props}
    >
      {spacedChildren({
        children:
          icon && contents
            ? [
                <React.Fragment key={0}>{icon}</React.Fragment>,
                <React.Fragment key={1}>{contents}</React.Fragment>,
              ]
            : icon ?? contents,
        spacing,
        flexDirection,
      })}
    </HStack>
  )
}

// if (process.env.IS_STATIC) {
//   Button.staticConfig = extendStaticConfig(HStack)
// }
