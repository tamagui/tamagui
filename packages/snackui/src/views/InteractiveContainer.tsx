import React from 'react'

import { HStack, StackProps } from './Stacks'

export const InteractiveContainer = (props: StackProps) => {
  return (
    <HStack
      borderRadius={10}
      borderWidth={1}
      borderColor="rgba(150,150,150,0.5)"
      hoverStyle={{
        borderColor: 'rgba(150,150,150,0.8)',
      }}
      overflow="hidden"
      {...props}
    />
  )
}
