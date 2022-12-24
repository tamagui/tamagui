import { FloatingOverlay, FloatingPortal } from '@floating-ui/react-dom-interactions'
import { Theme, useIsTouchDevice, useThemeName } from '@tamagui/core'
import { Dismissable } from '@tamagui/dismissable'
import { FocusScope, FocusScopeProps } from '@tamagui/focus-scope'

import { useSelectContext } from './context'
import { SelectContentProps } from './types'
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
  const themeName = useThemeName()
  const showSheet = useShowSelectSheet(context)
  const contents = <Theme name={themeName}>{children}</Theme>
  const touch = useIsTouchDevice()

  if (showSheet) {
    return context.open ? contents : null
  }

  return (
    <FloatingPortal>
      {context.open ? (
        <FloatingOverlay style={{ zIndex }} lockScroll={!touch}>
          <FocusScope loop trapped {...focusScopeProps}>
            <Dismissable disableOutsidePointerEvents>{contents}</Dismissable>
          </FocusScope>
        </FloatingOverlay>
      ) : (
        <div style={{ display: 'none' }}>{contents}</div>
      )}
    </FloatingPortal>
  )
}
