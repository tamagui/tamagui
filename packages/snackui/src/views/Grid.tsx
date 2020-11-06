import React from 'react'

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

  const childrenList = React.Children.toArray(children)

  return (
    <HStack alignItems="center" justifyContent="center" flexWrap="wrap">
      {childrenList.map((child, i) => {
        if (!child) {
          return null
        }

        // index key bad
        return (
          <HStack key={i} flex={1} minWidth={itemMinWidth}>
            {child}
          </HStack>
        )
      })}
    </HStack>
  )
}
