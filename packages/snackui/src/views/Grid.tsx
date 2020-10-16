import React from 'react'
import { View } from 'react-native'

import { isWeb } from '../constants'
import { HStack } from './Stacks'

export type GridProps = {
  children?: any
  itemMinWidth?: number
}

export function Grid({ children, itemMinWidth = 200 }: GridProps) {
  if (isWeb) {
    return (
      <div
        style={{
          display: 'grid',
          justifyContent: 'stretch',
          // gridTemplateRows: 'repeat(4, 1fr)',
          gridTemplateColumns: `repeat( auto-fit, minmax(${itemMinWidth}px, 1fr) )`,
        }}
      >
        {children}
      </div>
    )
  }

  return <HStack flexWrap="wrap">{children}</HStack>
}
