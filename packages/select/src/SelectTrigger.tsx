import { useComposedRefs } from '@tamagui/compose-refs'
import { isClient, isWeb, type TamaguiElement } from '@tamagui/core'
import type { ListItemProps } from '@tamagui/list-item'
import { ListItem } from '@tamagui/list-item'
import * as React from 'react'

import { useSelectContext, useSelectItemParentContext } from './context'
import type { SelectScopedProps } from './types'

/* -------------------------------------------------------------------------------------------------
 * SelectTrigger
 * -----------------------------------------------------------------------------------------------*/
const TRIGGER_NAME = 'SelectTrigger'

export type SelectTriggerProps = ListItemProps

const isPointerCoarse =
  isWeb && isClient ? window.matchMedia('(pointer:coarse)').matches : true

export const SelectTrigger = React.forwardRef<TamaguiElement, SelectTriggerProps>(
  function SelectTrigger(props: SelectScopedProps<SelectTriggerProps>, forwardedRef) {
    const { __scopeSelect, disabled = false, unstyled = false, ...triggerProps } = props

    const context = useSelectContext(TRIGGER_NAME, __scopeSelect)
    const itemParentContext = useSelectItemParentContext(TRIGGER_NAME, __scopeSelect)
    const composedRefs = useComposedRefs(
      forwardedRef,
      context.floatingContext?.refs.setReference as any
    )
    // const getItems = useCollection(__scopeSelect)
    // const labelId = useLabelContext(context.trigger)
    // const labelledBy = ariaLabelledby || labelId
    if (itemParentContext.shouldRenderWebNative) {
      return null
    }

    return (
      <ListItem
        componentName={TRIGGER_NAME}
        unstyled={unstyled}
        tag="button"
        type="button"
        id={itemParentContext.id}
        {...(!unstyled && {
          backgrounded: true,
          radiused: true,
          hoverTheme: true,
          pressTheme: true,
          focusable: true,
          focusVisibleStyle: {
            outlineStyle: 'solid',
            outlineWidth: 2,
            outlineColor: '$outlineColor',
          },
          borderWidth: 1,
          size: itemParentContext.size,
        })}
        // aria-controls={context.contentId}
        aria-expanded={context.open}
        aria-autocomplete="none"
        dir={context.dir}
        disabled={disabled}
        data-disabled={disabled ? '' : undefined}
        {...triggerProps}
        ref={composedRefs}
        {...(process.env.TAMAGUI_TARGET === 'web' && itemParentContext.interactions
          ? {
              ...itemParentContext.interactions.getReferenceProps(),
              ...(isPointerCoarse
                ? {
                    onPress() {
                      itemParentContext.setOpen(!context.open)
                    },
                  }
                : {
                    onMouseDown() {
                      context.floatingContext?.update()
                      itemParentContext.setOpen(!context.open)
                    },
                  }),
            }
          : {
              onPress() {
                itemParentContext.setOpen(!context.open)
              },
            })}
      />
    )
  }
)
