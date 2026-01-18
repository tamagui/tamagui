// via radix

import { composeRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import type { ReactNode } from 'react'
import { Children, cloneElement, forwardRef, isValidElement, memo } from 'react'
import { mergeSlotStyleProps } from '../helpers/mergeSlotStyleProps'

/* -------------------------------------------------------------------------------------------------
 * Slot
 * -----------------------------------------------------------------------------------------------*/

interface SlotProps {
  children: ReactNode
}

export const Slot = memo(
  forwardRef<any, SlotProps>(function Slot(props, forwardedRef) {
    const { children, ...slotProps } = props

    if (isValidElement(children)) {
      const mergedProps = mergeSlotProps(children, slotProps)
      return cloneElement(
        children,
        children.type['avoidForwardRef']
          ? mergedProps
          : {
              ...mergedProps,
              ref: composeRefs(forwardedRef, (children as any).props.ref),
            }
      )
    }

    return Children.count(children) > 1 ? Children.only(null) : null
  })
)

/* -------------------------------------------------------------------------------------------------
 * Slottable
 * -----------------------------------------------------------------------------------------------*/

export const Slottable = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

Slottable['displayName'] = 'Slottable'

/* ---------------------------------------------------------------------------------------------- */

const pressMap = isWeb
  ? {
      onPress: 'onClick',
      onPressOut: 'onMouseUp',
      onPressIn: 'onMouseDown',
    }
  : {}

function mergeSlotProps(child: any, slotProps: Record<string, any>) {
  const childProps = child.props
  const isHTMLChild = typeof child.type === 'string'

  // convert RN press events to web events for HTML children
  if (isHTMLChild) {
    for (const key in pressMap) {
      if (key in slotProps) {
        slotProps[pressMap[key]] = slotProps[key]
        delete slotProps[key]
      }
    }
  }

  // merge slot props with child props (child wins via overlay)
  const merged = mergeSlotStyleProps(slotProps, childProps)

  // convert child's RN press events to web events after merge
  if (isHTMLChild) {
    for (const key in pressMap) {
      if (key in merged) {
        merged[pressMap[key]] = merged[key]
        delete merged[key]
      }
    }
  }

  return merged
}
