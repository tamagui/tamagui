import React from 'react'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { useTheme } from '../hooks/useTheme'
import { StackProps } from '../StackProps'
import { VStack } from './Stacks'

export type BoxProps = StackProps

export function Box(props: BoxProps) {
  const theme = useTheme()
  return (
    <VStack
      backgroundColor={theme.backgroundColor}
      padding={5}
      borderRadius={12}
      shadowColor={theme.shadowColorLighter}
      shadowRadius={14}
      shadowOffset={{ width: 0, height: 3 }}
      {...props}
    />
  )
}

if (process.env.IS_STATIC) {
  // @ts-ignore
  Box.staticConfig = extendStaticConfig(VStack, {
    neverFlatten: true,
  })
}
