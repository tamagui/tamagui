// debug
import React from 'react'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { useTheme } from '../hooks/useTheme'
import { HStack, StackProps } from './Stacks'
import { Text } from './Text'

export type ButtonProps = StackProps

// TODO colors, spacing, static extract + colors/spacing
// TODO sizing, static + sizing
// TODO auto-chain

export const Button = ({ children, ...props }: ButtonProps) => {
  const theme = useTheme()
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
      {...props}
    >
      <Text color={theme.color}>{children}</Text>
    </HStack>
  )
}

if (process.env.IS_STATIC) {
  Button.staticConfig = extendStaticConfig(HStack)
}
