import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import {
  createChangeEventDetails,
  createStyledHOC,
  styled,
  View,
  type GetProps,
} from '@tamagui/core'
import { composeEventHandlers } from '@tamagui/helpers'
import * as React from 'react'

import { useSelectContext, useSelectItemParentContext } from './context'
import type { SelectOpenChangeDetails, SelectScopedProps } from './types'

const TRIGGER_NAME = 'SelectTrigger'

export const SelectTriggerFrame = styled(View, {
  displayName: TRIGGER_NAME,
  alignItems: 'center',
  flexDirection: 'row',
  render: <button type="button" />,
})

export type SelectTriggerProps = SelectScopedProps<GetProps<typeof SelectTriggerFrame>>

export const SelectTrigger = createStyledHOC(
  SelectTriggerFrame,
  function SelectTrigger(props: SelectTriggerProps, forwardedRef) {
    const { scope, disabled = false, ...triggerProps } = props
    const context = useSelectContext(scope)
    const itemParentContext = useSelectItemParentContext(scope)
    const composedRefs = useComposedRefs(
      forwardedRef,
      context.floatingContext?.refs.setReference as any
    )
    // whether the press in flight began as a touch, so its click opens
    const pressIsTouch = React.useRef(false)

    if (itemParentContext.shouldRenderWebNative) {
      return null
    }

    const toggleOpen = (
      event?: any,
      reason: 'trigger-press' | 'keyboard' = 'trigger-press'
    ) => {
      if (!disabled) {
        itemParentContext.requestOpenChange(
          !context.open,
          createChangeEventDetails(
            reason,
            event?.nativeEvent || event,
            event?.currentTarget
          ) as SelectOpenChangeDetails
        )
      }
    }
    const interactionProps =
      process.env.TAMAGUI_TARGET === 'web' && context.interactions
        ? context.interactions.getReferenceProps({
            ...triggerProps,
            onMouseDown: composeEventHandlers(triggerProps.onMouseDown as any, () =>
              context.floatingContext?.update?.()
            ),
          } as any)
        : {
            ...triggerProps,
            ...(isWeb
              ? {
                  // a mouse opens on press so a press, drag and release picks
                  // in one gesture. a touch opens on release, as a native
                  // select does: opening on touchstart mounts the sheet
                  // overlay under the finger, and the same tap's click then
                  // lands on it and closes the sheet again.
                  onMouseDown: composeEventHandlers(
                    triggerProps.onMouseDown as any,
                    (event: any) => {
                      pressIsTouch.current = event.type === 'touchstart'
                      if (pressIsTouch.current) return
                      event.preventDefault()
                      toggleOpen(event)
                    }
                  ),
                  onPress: composeEventHandlers(
                    triggerProps.onPress as any,
                    (event: any) => {
                      if (!pressIsTouch.current) return
                      pressIsTouch.current = false
                      toggleOpen(event)
                    }
                  ),
                }
              : {
                  onPress: composeEventHandlers(triggerProps.onPress as any, toggleOpen),
                }),
            onKeyDown: composeEventHandlers(
              triggerProps.onKeyDown as any,
              (event: any) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  toggleOpen(event, 'keyboard')
                }
              }
            ),
          }

    return (
      <SelectTriggerFrame
        type="button"
        id={itemParentContext.id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={context.open}
        {...(process.env.TAMAGUI_TARGET === 'web' && {
          'data-state': context.open ? 'open' : 'closed',
        })}
        aria-autocomplete="none"
        accessibilityRole={isWeb ? undefined : 'button'}
        accessibilityState={isWeb ? undefined : { expanded: context.open, disabled }}
        dir={context.dir}
        disabled={disabled}
        data-disabled={disabled ? '' : undefined}
        {...interactionProps}
        ref={composedRefs}
      />
    )
  }
)
