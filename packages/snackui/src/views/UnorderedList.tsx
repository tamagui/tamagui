import React from 'react'

import { getSizedTextProps } from './getSizedTextProps'
import { SizableTextProps } from './Size'
import { HStack, StackProps, VStack } from './Stacks'
import { Text } from './Text'

export const UnorderedList = (props: StackProps) => {
  return <VStack paddingLeft={20} {...props} />
}

export const UnorderedListItem = ({ children, ...props }: SizableTextProps) => {
  const { fontSize = 14, lineHeight } = getSizedTextProps(props)
  return (
    <HStack marginVertical={4}>
      <Text
        {...props}
        fontSize={fontSize * 2}
        lineHeight={fontSize * 1.333}
      >{`\u2022`}</Text>
      <Text
        flex={1}
        paddingLeft={fontSize * 0.5}
        fontSize={fontSize}
        lineHeight={lineHeight}
        {...props}
      >
        {children}
      </Text>
    </HStack>
  )
}
