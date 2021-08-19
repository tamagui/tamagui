import React from 'react'
import { Paragraph } from './Paragraph'
import { StackProps } from '../StackProps'
import { getSizedTextProps } from './getSizedTextProps'
import { SizableTextProps } from './SizableTextProps'
import { HStack, VStack } from './Stacks'


export const UnorderedList = (props: StackProps) => {
  return <VStack paddingLeft={20} {...props} />
}

export const UnorderedListItem = (props: SizableTextProps) => {
  const { fontSize = 14, lineHeight, ...rest } = getSizedTextProps(props)
  return (
    <HStack marginVertical={4}>
      <Paragraph {...props} fontSize={fontSize * 2} lineHeight={fontSize * 1.333}>{`\u2022`}</Paragraph>
      <Paragraph
        flex={1}
        paddingLeft={fontSize * 0.5}
        fontSize={fontSize}
        lineHeight={lineHeight}
        {...rest}
      />
    </HStack>
  )
}
