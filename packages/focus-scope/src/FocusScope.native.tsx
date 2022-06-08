import { forwardRef } from 'react'

import { FocusScopeProps } from './FocusScopeProps'

export const FocusScope = forwardRef((props: FocusScopeProps, _ref) => {
  return props.children as any
})
