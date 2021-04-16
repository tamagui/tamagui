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
      shadowColor="rgba(0,0,0,0.125)"
      shadowRadius={14}
      shadowOffset={{ width: 0, height: 3 }}
      {...props}
    />
  )
}
