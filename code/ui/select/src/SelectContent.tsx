import { useAdaptContext, useAdaptIsActive } from '@tamagui/adapt'
import { createChangeEventDetails } from '@tamagui/core'
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
import type { SelectOpenChangeDetails } from './types'

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
          onDismiss={(details) =>
            itemParentContext.requestOpenChange(
              false,
              createChangeEventDetails(
                details.reason === 'escape-key' ? 'escape-key' : 'outside-press',
                details.event,
                details.trigger
              ) as SelectOpenChangeDetails
            )
          }
          onEscapeKeyDown={onEscapeKeyDown}
          onInteractOutside={onInteractOutside}
          // focus changes during open should not dismiss the list
          onFocusOutside={composeEventHandlers(onFocusOutside, (e) => e.cancel(), {
            checkDefaultPrevented: false,
          })}
          onPointerDownOutside={composeEventHandlers(
            onPointerDownOutside,
            (details) => {
              const trigger = context.floatingContext?.refs?.reference?.current
              const target = details.event?.target
              if (trigger instanceof HTMLElement && target instanceof Node) {
                if (trigger.contains(target)) details.cancel()
              }
            },
            { checkDefaultPrevented: false }
          )}
        >
          <FocusScope
            {...focusScopeProps}
            enabled={!!context.open}
            trapped
            onMountAutoFocus={(e) => {
              // prevent FocusScope from auto-focusing - floating-ui handles focus in SelectItem
              e.cancel()
            }}
            onUnmountAutoFocus={(e) => {
              // return focus to trigger on close
              e.cancel()
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
