import { useComposedRefs } from '@tamagui/compose-refs'
import type { GetProps, TamaguiTextElement } from '@tamagui/core'
import { styled, useIsomorphicLayoutEffect } from '@tamagui/core'
import { SizableText } from '@tamagui/text'
import * as React from 'react'

import { useSelectItemParentContext } from './context'
import { useSelectItemContext } from './SelectItem'
import type { SelectScopedProps } from './types'

/* -------------------------------------------------------------------------------------------------
 * SelectItemText
 * -----------------------------------------------------------------------------------------------*/

export const ITEM_TEXT_NAME = 'SelectItemText'

export const SelectItemTextFrame = styled(SizableText, {
  name: ITEM_TEXT_NAME,

  variants: {
    unstyled: {
      false: {
        userSelect: 'none',
        color: '$color',
        ellipsis: true,
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

type SelectItemTextExtraProps = SelectScopedProps<{}>
export type SelectItemTextProps = GetProps<typeof SelectItemTextFrame> &
  SelectItemTextExtraProps

export const SelectItemText = SelectItemTextFrame.styleable<SelectItemTextExtraProps>(
  function SelectItemText(props, forwardedRef) {
    const { scope, className, ...itemTextProps } = props
    // note: only uses itemParentContext (not selectContext) to avoid re-renders
    // when activeIndex changes on hover
    const itemParentContext = useSelectItemParentContext(scope)
    const ref = React.useRef<TamaguiTextElement | null>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)
    const itemContext = useSelectItemContext(scope)
    const contents = React.useRef<React.ReactNode>(null)

    // we portal this to the selected area, which is fine to be a bit unsafe concurrently (mostly? its not changing often)...
    // until react native supports portals this is best i think
    contents.current = (
      <SelectItemTextFrame
        className={className}
        size={itemParentContext.size as any}
        id={itemContext.textId}
        {...itemTextProps}
        ref={composedRefs}
      />
    )

    useIsomorphicLayoutEffect(() => {
      if (itemParentContext.initialValue === itemContext.value) {
        itemParentContext.setSelectedItem(contents.current)
      }
    }, [])

    useIsomorphicLayoutEffect(() => {
      return itemParentContext.valueSubscribe((val) => {
        if (val === itemContext.value) {
          itemParentContext.setSelectedItem(contents.current)
        }
      })
    }, [itemContext.value])

    if (itemParentContext.shouldRenderWebNative) {
      return <>{props.children}</>
    }

    return <>{contents.current}</>
  }
)
