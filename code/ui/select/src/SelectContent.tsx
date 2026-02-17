import { isWeb, useThemeName } from '@tamagui/core'
import { Dismissable } from '@tamagui/dismissable'
import type { FocusScopeProps } from '@tamagui/focus-scope'
import { FocusScope } from '@tamagui/focus-scope'

import { Portal } from '@tamagui/portal'
import { RemoveScroll } from '@tamagui/remove-scroll'
import { useSelectContext, useSelectItemParentContext } from './context'
import type { SelectContentProps } from './types'
import { useShowSelectSheet } from './useSelectBreakpointActive'

/* -------------------------------------------------------------------------------------------------
 * SelectContent
 * -----------------------------------------------------------------------------------------------*/

export const SelectContent = ({
  children,
  scope,
  zIndex = 1000,
  ...focusScopeProps
}: SelectContentProps & FocusScopeProps) => {
  const context = useSelectContext(scope)
  const itemParentContext = useSelectItemParentContext(scope)
  const showSheet = useShowSelectSheet(context)

  const contents = children

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
    <Portal open={context.open} stackZIndex>
      <RemoveScroll enabled={context.open}>
        <Dismissable asChild forceUnmount={!context.open}>
          <FocusScope
            {...focusScopeProps}
            enabled={!!context.open}
            trapped
            onMountAutoFocus={(e) => {
              // prevent FocusScope from auto-focusing - floating-ui handles focus in SelectItem
              e.preventDefault()
            }}
            onUnmountAutoFocus={(e) => {
              // return focus to trigger on close
              e.preventDefault()
              const trigger = context.floatingContext?.refs?.reference?.current
              if (trigger instanceof HTMLElement) {
                trigger.focus()
              }
            }}
          >
            {/* div needed for FocusScope ref, display:contents keeps layout neutral */}
            {isWeb ? <div style={{ display: 'contents' }}>{contents}</div> : contents}
          </FocusScope>
        </Dismissable>
      </RemoveScroll>
    </Portal>
  )
}
