import React from 'react'
import { FloatingOverlay, FloatingPortal } from '@floating-ui/react'
import { Theme, useIsTouchDevice, useThemeName } from '@tamagui/core'
import type { FocusScopeProps } from '@tamagui/focus-scope'
import { FocusScope } from '@tamagui/focus-scope'

import { useSelectContext, useSelectItemParentContext } from './context'
import type { SelectContentProps } from './types'
import { useShowSelectSheet } from './useSelectBreakpointActive'

/* -------------------------------------------------------------------------------------------------
 * SelectContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'SelectContent'

export const SelectContent = ({
  children,
  __scopeSelect,
  zIndex = 1000,
  ...focusScopeProps
}: SelectContentProps & FocusScopeProps) => {
  const context = useSelectContext(CONTENT_NAME, __scopeSelect)
  const itemParentContext = useSelectItemParentContext(CONTENT_NAME, __scopeSelect)
  const themeName = useThemeName()
  const showSheet = useShowSelectSheet(context)

  const contents = (
    <Theme forceClassName name={themeName}>
      {children}
    </Theme>
  )

  const touch = useIsTouchDevice()

  const overlayStyle = React.useMemo(() => {
    return { zIndex, pointerEvents: context.open ? 'auto' : 'none' } as const
  }, [context.open])

  if (itemParentContext.shouldRenderWebNative) {
    return <>{children}</>
  }

  if (showSheet) {
    if (!context.open) {
      return null
    }
    return <>{contents}</>
  }

  return (
    <FloatingPortal>
      <FloatingOverlay
        style={overlayStyle}
        lockScroll={!context.disablePreventBodyScroll && !!context.open && !touch}
      >
        <FocusScope loop enabled={!!context.open} trapped {...focusScopeProps}>
          {contents}
        </FocusScope>
      </FloatingOverlay>
    </FloatingPortal>
  )
}
