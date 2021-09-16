import React, { Children } from 'react'
import { View, ViewStyle } from 'react-native'

import { Spacing, getSpacerStyle } from '../views/Spacer'

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
  if (len === 1) {
    return children
  }
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
    const key = `${child?.['key'] ?? index}`
    next.push(<React.Fragment key={key + '_spacer'}>{spacer}</React.Fragment>)
  }
  return next
}
