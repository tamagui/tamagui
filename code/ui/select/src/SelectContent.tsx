import { isWeb } from '@tamagui/core'
import { Dismissable } from '@tamagui/dismissable'
import type { FocusScopeProps } from '@tamagui/focus-scope'
import { FocusScope } from '@tamagui/focus-scope'

import { Portal } from '@tamagui/portal'
import { RemoveScroll } from '@tamagui/remove-scroll'
import { useContext } from 'react'
import {
  SelectZIndexContext,
  useSelectContext,
  useSelectItemParentContext,
} from './context'
import type { SelectContentProps } from './types'
import { useShowSelectSheet } from './useSelectBreakpointActive'

/* -------------------------------------------------------------------------------------------------
 * SelectContent
 * -----------------------------------------------------------------------------------------------*/

export const SelectContent = ({
  children,
  scope,
  ...focusScopeProps
}: SelectContentProps & FocusScopeProps) => {
  const context = useSelectContext(scope)
  const itemParentContext = useSelectItemParentContext(scope)
  const zIndex = useContext(SelectZIndexContext)
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
    <Portal open={context.open} zIndex={zIndex} stackZIndex={100_000}>
      <RemoveScroll enabled={context.open && !context.disablePreventBodyScroll}>
        <Dismissable
          asChild
          forceUnmount={!context.open}
          onDismiss={() => itemParentContext.setOpen(false)}
          // prevent focus-outside and pointer-outside from triggering dismiss:
          // SelectImpl has its own document pointerdown listener for outside clicks,
          // and focus changes during open (e.g. FocusScope trapping) shouldn't dismiss.
          // only escape key should trigger onDismiss here.
          onFocusOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
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
