import React from 'react'

import type { DismissableBranchProps, DismissableProps } from './DismissableProps'

export const Dismissable = React.forwardRef((props: DismissableProps, _ref) => {
  return props.children as any
})

export const DismissableBranch = React.forwardRef(
  (props: DismissableBranchProps, _ref) => {
    return props.children as any
  }
)
