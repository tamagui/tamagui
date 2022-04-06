import React, { Children, Fragment } from 'react'
import { ViewStyle } from 'react-native'

import { AbsoluteFill, Spacer } from './createComponent'

export function spacedChildren({
  isZStack,
  children,
  space,
  flexDirection,
  spaceFlex,
}: {
  isZStack?: boolean
  children: any
  space?: any
  spaceFlex?: boolean | number
  flexDirection?: ViewStyle['flexDirection']
}) {
  if (!space && !isZStack) {
    return children
  }
  const childrenList = Children.toArray(children)
  const len = childrenList.length
  if (len === 1) {
    return children
  }
  const next: any[] = []
  for (const [index, child] of childrenList.entries()) {
    if (child === null || child === undefined) {
      continue
    }

    const key = `${child?.['key'] ?? index}`

    next.push(
      <Fragment key={key}>{isZStack ? <AbsoluteFill>{child}</AbsoluteFill> : child}</Fragment>
    )

    // allows for custom visually hidden components that dont insert spacing
    if (child?.['type']?.['isVisuallyHidden']) {
      continue
    }

    if (index !== len - 1) {
      if (space) {
        next.push(
          <Spacer
            key={`${key}_spacer`}
            // @ts-ignore TODO
            direction={
              flexDirection === 'row' || flexDirection === 'row-reverse' ? 'horizontal' : 'vertical'
            }
            size={space}
            {...(spaceFlex && {
              flex: spaceFlex,
            })}
          />
        )
      }
    }
  }
  return next
}
