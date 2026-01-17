// via radix

import { composeRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import { composeEventHandlers } from '@tamagui/helpers'
import type { ReactNode } from 'react'
import { Children, cloneElement, forwardRef, isValidElement, version, memo } from 'react'

/* -------------------------------------------------------------------------------------------------
 * Slot
 * -----------------------------------------------------------------------------------------------*/

interface SlotProps {
  children: ReactNode
}

const is19 = version.startsWith('19.')

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
              ref: composeRefs(
                forwardedRef,
                is19 ? (children as any).props.ref : (children as any).ref
              ),
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

  // all child props should override
  const overrideProps = { ...childProps }
  const isHTMLChild = typeof child.type === 'string'

  if (isHTMLChild) {
    for (const key in pressMap) {
      if (key in slotProps) {
        slotProps[pressMap[key]] = slotProps[key]
        delete slotProps[key]
      }
    }
  }

  for (let propName in childProps) {
    const slotPropValue = slotProps[propName]
    const childPropValue = childProps[propName]

    if (isHTMLChild && propName in pressMap) {
      propName = pressMap[propName]
      delete overrideProps[propName]
    }

    const isHandler = handleRegex.test(propName)
    // if it's a handler, modify the override by composing the base handler
    if (isHandler) {
      overrideProps[propName] = composeEventHandlers(childPropValue, slotPropValue)
    }
    // if it's `style`, we merge them
    else if (propName === 'style') {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue }
    } else if (propName === 'className') {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(' ')
    }
  }

  return { ...slotProps, ...overrideProps }
}

const handleRegex = /^on[A-Z]/
