import React from 'react'

import { useTheme } from '../hooks/useTheme'
import { HStack, StackProps } from './Stacks'

export const InteractiveContainer = (props: StackProps) => {
  const theme = useTheme()
  return (
    <HStack
      borderRadius={10}
      borderWidth={1}
      borderColor={theme.borderColor}
      hoverStyle={{
        borderColor: theme.borderColorHover,
      }}
      overflow="hidden"
      {...props}
    />
  )
}
