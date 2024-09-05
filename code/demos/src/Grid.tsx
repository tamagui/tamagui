import { isWeb } from '@tamagui/core'
import { XStack } from '@tamagui/stacks'
import React from 'react'

export type GridProps = {
  children?: any
  itemMinWidth?: number
  gap?: any
  columns?: number
}

export function Grid({ children, columns, itemMinWidth = 200, gap }: GridProps) {
  if (isWeb) {
    return (
      <div
        style={{
          gap,
          display: 'grid',
          justifyContent: 'stretch',
          // gridTemplateRows: 'repeat(4, 1fr)',
          gridTemplateColumns: `repeat( auto-fit, minmax(${itemMinWidth}px, 1fr) )`,
          // gridTemplateColumns: '1fr 1fr',
        }}
      >
        {children}
      </div>
    )
  }

  const childrenList = React.Children.toArray(children)

  return (
    <XStack alignItems="center" justifyContent="center" flexWrap="wrap">
      {childrenList.map((child, i) => {
        if (!child) {
          return null
        }

        // index key bad
        return (
          <XStack
            key={i}
            flex={1}
            minWidth={itemMinWidth}
            marginRight={gap}
            marginBottom={gap}
          >
            {child}
          </XStack>
        )
      })}
    </XStack>
  )
}
