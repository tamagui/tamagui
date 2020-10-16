import React, { useRef } from 'react'

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
  const scale = size === 'sm' ? 0.5 : size === 'lg' ? 1.75 : 1
  return (
    <VStack
      overflow="hidden"
      className="shine"
      padding={20}
      spacing={10 * scale}
    >
      <HStack
        width={`${seed * 12}%`}
        height={28 * scale}
        backgroundColor="rgba(0,0,0,0.05)"
        borderRadius={7}
      />
      <VStack spacing={6 * scale}>
        {new Array(lines).fill(0).map((_, index) => (
          <HStack
            key={index}
            width={`${seed * (15 - (2 - index > -1 ? index : -index) * 4)}%`}
            height={20 * scale}
            maxWidth="100%"
            backgroundColor="rgba(0,0,0,0.025)"
            borderRadius={5}
          />
        ))}
      </VStack>
    </VStack>
  )
}
