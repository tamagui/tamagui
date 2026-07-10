import { useAdaptContext, useAdaptIsActive } from '@tamagui/adapt'
import { Dismissable } from '@tamagui/dismissable'
import type { FocusScopeProps } from '@tamagui/focus-scope'
import { FocusScope } from '@tamagui/focus-scope'
import { composeEventHandlers } from '@tamagui/helpers'

import { Portal } from '@tamagui/portal'
import { RemoveScroll } from '@tamagui/remove-scroll'
import { useContext } from 'react'
import {
  SelectZIndexContext,
  useSelectContext,
  useSelectItemParentContext,
} from './context'
import type { SelectContentProps } from './types'

/* -------------------------------------------------------------------------------------------------
 * SelectContent
 * -----------------------------------------------------------------------------------------------*/

export const SelectContent = ({
  children,
  scope,
  onEscapeKeyDown,
  onPointerDownOutside,
  onFocusOutside,
  onInteractOutside,
  ...focusScopeProps
}: SelectContentProps & FocusScopeProps) => {
  const context = useSelectContext(scope)
  const itemParentContext = useSelectItemParentContext(scope)
  const zIndex = useContext(SelectZIndexContext)
  const isAdapted = useAdaptIsActive(context.adaptScope)
  const adaptContext = useAdaptContext(context.adaptScope)

  const contents = children

  if (itemParentContext.shouldRenderWebNative) {
    return <>{children}</>
  }

  if (isAdapted) {
    // content is published into the Sheet via SelectViewport's AdaptPortalContents;
    // keep it mounted through the sheet slide-out (adaptContext.targetFullyHidden),
    // otherwise the sheet body vanishes mid-slide on close. mirrors Popover/Dialog.
    if (!context.open && adaptContext.targetFullyHidden) {
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
          onEscapeKeyDown={onEscapeKeyDown}
          onInteractOutside={onInteractOutside}
          // prevent focus-outside and pointer-outside from triggering dismiss:
          // SelectImpl has its own document pointerdown listener for outside clicks,
          // and focus changes during open (e.g. FocusScope trapping) shouldn't dismiss.
          // only escape key should trigger onDismiss here. user handlers run first,
          // then we always preventDefault so this layer never auto-dismisses.
          onFocusOutside={composeEventHandlers(onFocusOutside, (e) => e.preventDefault(), {
            checkDefaultPrevented: false,
          })}
          onPointerDownOutside={composeEventHandlers(
            onPointerDownOutside,
            (e) => e.preventDefault(),
            { checkDefaultPrevented: false }
          )}
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
            {contents}
          </FocusScope>
        </Dismissable>
      </RemoveScroll>
    </Portal>
  )
}
