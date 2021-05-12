import React, { useRef } from 'react'

import { Spacer } from './Spacer'
import { HStack, VStack } from './Stacks'

export const LoadingItems = () => (
  <VStack spacing="sm" width="100%">
    <LoadingItem />
    <LoadingItem />
    <LoadingItem />
  </VStack>
)

export const LoadingItemsSmall = () => (
  <VStack spacing="xs" width="100%">
    <LoadingItem size="sm" />
    <LoadingItem size="sm" />
    <LoadingItem size="sm" />
  </VStack>
)

// same across all instances, less flickers
const seed = Math.max(3, Math.min(6, Math.round(Math.random() * 10)))

export const LoadingItem = ({
  size = 'md',
  lines = 3,
}: {
  size?: 'sm' | 'md' | 'lg'
  lines?: number
}) => {
  return (
    <VStack overflow="hidden" padding={20}>
      <HStack
        width={`${seed * 12}%`}
        height={size === 'sm' ? 14 : size === 'lg' ? 36 : 28}
        backgroundColor="rgba(150,150,150,0.085)"
        borderRadius={7}
      />
      <Spacer size={size === 'sm' ? 6 : size === 'lg' ? 16 : 12} />
      {new Array(lines).fill(0).map((_, index) => (
        <React.Fragment key={index}>
          <HStack
            className="shine"
            width={`${seed * (15 - (2 - index > -1 ? index : -index) * 4)}%`}
            height={size === 'sm' ? 14 : size === 'lg' ? 22 : 16}
            maxWidth="100%"
            backgroundColor="rgba(150,150,150,0.015)"
            borderRadius={5}
          />
          <Spacer size={size === 'sm' ? 6 : 12} />
        </React.Fragment>
      ))}
    </VStack>
  )
}
