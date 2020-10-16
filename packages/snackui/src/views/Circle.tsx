import React from 'react'

import { StackProps, VStack } from './Stacks'

export type CircleProps = StackProps & {
  size: number
}

export const Circle = ({ size, ...props }: CircleProps) => {
  return (
    <VStack
      alignItems="center"
      justifyContent="center"
      borderRadius={100000000000}
      overflow="hidden"
      width={size}
      height={size}
      {...props}
    />
  )
}
