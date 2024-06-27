import { forwardRef } from 'react'

import type { FocusScopeProps } from './FocusScopeProps'

export const FocusScope = forwardRef((props: FocusScopeProps, _ref) => {
  return props.children as any
})
