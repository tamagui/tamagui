import { TamaguiElement } from '@tamagui/core'
import { PortalItem } from '@tamagui/portal'
import * as React from 'react'

import { VIEWPORT_NAME } from './constants'
import { useSelectContext } from './context'
import { ScopedProps, SelectViewportProps } from './types'

export const SelectViewport = React.forwardRef<TamaguiElement, SelectViewportProps>(
  (props: ScopedProps<SelectViewportProps>) => {
    const { __scopeSelect, children } = props
    const context = useSelectContext(VIEWPORT_NAME, __scopeSelect)
    return <PortalItem hostName={`${context.scopeKey}SheetContents`}>{children}</PortalItem>
  }
)

SelectViewport.displayName = VIEWPORT_NAME
