import { useComposedRefs } from '@tamagui/compose-refs'
import { createStyledHOC, styled, View, type GetProps } from '@tamagui/core'
import { composeEventHandlers } from '@tamagui/helpers'
import * as React from 'react'

import { useSelectContext, useSelectItemParentContext } from './context'
import type { SelectScopedProps } from './types'

const TRIGGER_NAME = 'SelectTrigger'

export const SelectTriggerFrame = styled(View, {
  name: TRIGGER_NAME,
  alignItems: 'center',
  flexDirection: 'row',
  render: <button type="button" />,
})

export type SelectTriggerProps = SelectScopedProps<GetProps<typeof SelectTriggerFrame>>

const isPointerCoarse =
  typeof window !== 'undefined' && process.env.TAMAGUI_TARGET === 'web'
    ? window.matchMedia('(pointer:coarse)').matches
    : true

export const SelectTrigger = createStyledHOC(SelectTriggerFrame)<{ scope?: string }>(
  function SelectTrigger(props: SelectTriggerProps, forwardedRef) {
    const { scope, disabled = false, ...triggerProps } = props
    const context = useSelectContext(scope)
    const itemParentContext = useSelectItemParentContext(scope)
    const composedRefs = useComposedRefs(
      forwardedRef,
      context.floatingContext?.refs.setReference as any
    )

    if (itemParentContext.shouldRenderWebNative) {
      return null
    }

    const toggleOpen = () => {
      if (!disabled) {
        itemParentContext.setOpen(!context.open)
      }
    }
    const interactionProps =
      process.env.TAMAGUI_TARGET === 'web' && itemParentContext.interactions
        ? itemParentContext.interactions.getReferenceProps({
            ...triggerProps,
            ...(isPointerCoarse
              ? {
                  onPress: composeEventHandlers(triggerProps.onPress as any, toggleOpen),
                }
              : {
                  onMouseDown: composeEventHandlers(
                    triggerProps.onMouseDown as any,
                    () => {
                      context.floatingContext?.update?.()
                      toggleOpen()
                    }
                  ),
                }),
          } as any)
        : {
            ...triggerProps,
            onPress: composeEventHandlers(triggerProps.onPress as any, toggleOpen),
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
        dir={context.dir}
        disabled={disabled}
        data-disabled={disabled ? '' : undefined}
        {...interactionProps}
        ref={composedRefs}
      />
    )
  }
)
