// // debug
import React from 'react'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { useTheme } from '../hooks/useTheme'
import { HStack, StackProps } from './Stacks'

export type ButtonProps = StackProps

// TODO colors, spacing, static extract + colors/spacing
// TODO sizing, static + sizing

export const Button = (props: ButtonProps) => {
  const theme = useTheme()
  return (
    <HStack
      backgroundColor={theme.backgroundColorSecondary}
      alignSelf="flex-start"
      pointerEvents="auto"
      cursor="pointer"
      padding={5}
      borderRadius={5}
      hoverStyle={{
        backgroundColor: theme.backgroundColorTertiary,
      }}
      pressStyle={{
        backgroundColor: theme.backgroundColorTertiary,
      }}
      {...props}
    />
  )
}

if (process.env.IS_STATIC) {
  Button.staticConfig = extendStaticConfig(HStack)
}
