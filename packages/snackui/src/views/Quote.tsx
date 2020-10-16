import React, { memo } from 'react'

import { HStack, VStack } from './Stacks'
import { Text, TextProps } from './Text'

export const Quote = memo(
  ({
    by,
    ...props
  }: TextProps & {
    by?: string
  }) => {
    return (
      <HStack spacing={10}>
        <Text fontSize={40} color="#ccc" marginTop={-10} marginBottom={0}>
          “
        </Text>
        <VStack spacing={6} flex={1}>
          <Text fontSize={props.fontSize ?? 16} color={props.color ?? '#999'}>
            “
          </Text>
          {!!by && (
            <Text fontWeight="bold" fontSize={13} color="#999" {...props}>
              {by}
            </Text>
          )}
        </VStack>
      </HStack>
    )
  }
)
