import React from 'react'

import type { FocusScopeProps } from './types'

export const FocusScope = React.forwardRef((props: FocusScopeProps, _ref) => {
  return props.children as any
})
