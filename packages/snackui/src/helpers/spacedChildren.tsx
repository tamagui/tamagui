import React from 'react'
import { Children } from 'react'
import { ViewProps, ViewStyle } from 'react-native'

import { Spacer, SpacerProps, Spacing } from '../views/Spacer'

export function spacedChildren({
  children,
  spacing,
  flexDirection,
}: {
  children: any
  spacing?: Spacing
  flexDirection?: ViewStyle['flexDirection']
}) {
  if (typeof spacing === 'undefined') {
    return children
  }
  const next: any[] = []
  const childrenList = Children.toArray(children)
  const len = childrenList.length
  const spacer = (
    <Spacer
      size={spacing}
      direction={
        flexDirection === 'row' || flexDirection === 'row-reverse'
          ? 'horizontal'
          : 'vertical'
      }
    />
  )
  for (const [index, child] of childrenList.entries()) {
    next.push(child)
    if (index === len - 1) {
      break
    }
    next.push(<React.Fragment key={index}>{spacer}</React.Fragment>)
  }
  return next
}
