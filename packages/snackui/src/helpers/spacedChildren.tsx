import React, { Children } from 'react'
import { View, ViewStyle } from 'react-native'

import { Spacing, getSpacerStyle } from '../views/Spacer'
import { VStack } from '../views/Stacks'

export function spacedChildren({
  children,
  spacing,
  flexDirection,
}: {
  children: any
  spacing?: Spacing
  flexDirection?: ViewStyle['flexDirection']
}) {
  if (!spacing) {
    return children
  }
  const next: any[] = []
  const childrenList = Children.toArray(children)
  const len = childrenList.length
  const spacer = (
    <View
      style={getSpacerStyle({
        size: spacing,
        direction:
          flexDirection === 'row' || flexDirection === 'row-reverse' ? 'horizontal' : 'vertical',
      })}
    />
  )
  for (const [index, child] of childrenList.entries()) {
    next.push(child)
    if (index === len - 1) {
      break
    }
    next.push(<React.Fragment key={index}>{spacer}</React.Fragment>)
  }
  if (childrenList.includes('Delivery')) {
    debugger
  }
  return next
}
