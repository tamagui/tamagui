import { createRefComponent } from '@tamagui/compose-refs'
import React from 'react'

import type { FocusScopeProps } from './types'

export const FocusScope = createRefComponent((props: FocusScopeProps, _ref) => {
  return props.children as any
})
