import { useComposedRefs } from '@tamagui/compose-refs'
import type { GetProps, TamaguiTextElement } from '@tamagui/core'
import { styled } from '@tamagui/core'
import { SizableText } from '@tamagui/text'
import * as React from 'react'

import { useSelectContext, useSelectItemParentContext } from './context'
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
        ellipse: true,
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

export type SelectItemTextProps = GetProps<typeof SelectItemTextFrame>

export const SelectItemText = SelectItemTextFrame.styleable(function SelectItemText(
  props: SelectScopedProps<SelectItemTextProps>,
  forwardedRef
) {
  const { __scopeSelect, className, ...itemTextProps } = props
  const context = useSelectContext(ITEM_TEXT_NAME, __scopeSelect)
  const itemParentContext = useSelectItemParentContext(ITEM_TEXT_NAME, __scopeSelect)
  const ref = React.useRef<TamaguiTextElement | null>(null)
  const composedRefs = useComposedRefs(forwardedRef, ref)
  const itemContext = useSelectItemContext(ITEM_TEXT_NAME, __scopeSelect)
  const contents = React.useRef<React.ReactNode>()

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

  React.useEffect(() => {
    if (itemParentContext.initialValue === itemContext.value && !context.selectedIndex) {
      context.setSelectedItem(contents.current)
    }
  }, [])

  React.useEffect(() => {
    return itemParentContext.valueSubscribe((val) => {
      if (val === itemContext.value) {
        context.setSelectedItem(contents.current)
      }
    })
  }, [itemContext.value])

  if (itemParentContext.shouldRenderWebNative) {
    return <>{props.children}</>
  }

  return (
    <>
      {contents.current}

      {/* Portal an option in the bubble select */}
      {/* {context.bubbleSelect
              ? ReactDOM.createPortal(
                  // we use `.textContent` because `option` only support `string` or `number`
                  <option value={itemContext.value}>{ref.current?.textContent}</option>,
                  context.bubbleSelect
                )
              : null} */}
    </>
  )
})
