import React from 'react'

import { useTheme } from '../hooks/useTheme'
import { StackProps, VStack } from './Stacks'

export type BoxProps = StackProps

export function Box(props: BoxProps) {
  const theme = useTheme()
  return (
    <VStack
      backgroundColor={theme.backgroundColor}
      padding={5}
      borderRadius={12}
      shadowColor={theme.shadowColor}
      shadowRadius={14}
      shadowOffset={{ width: 0, height: 3 }}
      {...props}
    />
  )
}
