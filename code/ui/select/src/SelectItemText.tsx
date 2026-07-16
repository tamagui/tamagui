import { useComposedRefs } from '@tamagui/compose-refs'
import type { GetProps, TamaguiTextElement } from '@tamagui/core'
import { createStyledHOC, styled, Text, useIsomorphicLayoutEffect } from '@tamagui/core'
import * as React from 'react'

import { useSelectItemParentContext } from './context'
import { useSelectItemContext } from './SelectItem'
import type { SelectScopedProps } from './types'

/* -------------------------------------------------------------------------------------------------
 * SelectItemText
 * -----------------------------------------------------------------------------------------------*/

export const ITEM_TEXT_NAME = 'SelectItemText'

export const SelectItemTextFrame = styled(Text, {
  name: ITEM_TEXT_NAME,
})

type SelectItemTextExtraProps = SelectScopedProps<{}>
export type SelectItemTextProps = GetProps<typeof SelectItemTextFrame> &
  SelectItemTextExtraProps

export const SelectItemText = createStyledHOC(
  SelectItemTextFrame
)<SelectItemTextExtraProps>(function SelectItemText(props, forwardedRef) {
  const { scope, className, ...itemTextProps } = props
  // note: only uses itemParentContext (not selectContext) to avoid re-renders
  // when activeIndex changes on hover
  const itemParentContext = useSelectItemParentContext(scope)
  const ref = React.useRef<TamaguiTextElement | null>(null)
  const composedRefs = useComposedRefs(forwardedRef, ref)
  const itemContext = useSelectItemContext(scope)
  const contents = React.useRef<React.ReactNode>(null)
  const label = React.useRef(props.children)
  label.current = props.children

  // we portal this to the selected area, which is fine to be a bit unsafe concurrently (mostly? its not changing often)...
  // until react native supports portals this is best i think
  contents.current = (
    <SelectItemTextFrame
      className={className}
      id={itemContext.textId}
      {...itemTextProps}
      ref={composedRefs}
    />
  )

  useIsomorphicLayoutEffect(() => {
    return itemParentContext.registry.registerLabel(
      itemContext.value,
      label.current,
      itemContext.textValue
    )
  }, [itemContext.textValue, itemContext.value, itemParentContext.registry])

  if (itemParentContext.shouldRenderWebNative) {
    return <>{props.children}</>
  }

  return <>{contents.current}</>
})
