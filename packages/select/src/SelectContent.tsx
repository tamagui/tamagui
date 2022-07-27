import { FloatingOverlay, FloatingPortal } from '@floating-ui/react-dom-interactions'
import { Theme, useIsTouchDevice, useThemeName } from '@tamagui/core'
import * as React from 'react'

import { useSelectContext } from './context'
import { useShowSelectSheet } from './Select'
import { SelectContentProps } from './types'

/* -------------------------------------------------------------------------------------------------
 * SelectContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'SelectContent'

export const SelectContent = ({ children, __scopeSelect }: SelectContentProps) => {
  const context = useSelectContext(CONTENT_NAME, __scopeSelect)
  const themeName = useThemeName()
  const showSheet = useShowSelectSheet(context)
  const contents = <Theme name={themeName}>{children}</Theme>
  const touch = useIsTouchDevice()

  if (showSheet && context.open) {
    return contents
  }

  return (
    <FloatingPortal>
      {context.open ? (
        // TODO inside overlay <FloatingFocusManager context={context} preventTabbing>
        <FloatingOverlay lockScroll={!touch}>{contents}</FloatingOverlay>
      ) : (
        <div style={{ display: 'none' }}>{contents}</div>
      )}
    </FloatingPortal>
  )
}
