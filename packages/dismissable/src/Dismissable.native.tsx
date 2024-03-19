import { forwardRef } from 'react'

import type { DismissableBranchProps, DismissableProps } from './DismissableProps'

export const Dismissable = forwardRef((props: DismissableProps, _ref) => {
  return props.children as any
})

export const DismissableBranch = forwardRef((props: DismissableBranchProps, _ref) => {
  return props.children as any
})
