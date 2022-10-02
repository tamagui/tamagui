// via radix

import { composeRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import { Children, ReactElement, ReactNode, cloneElement, forwardRef, isValidElement } from 'react'

/* -------------------------------------------------------------------------------------------------
 * Slot
 * -----------------------------------------------------------------------------------------------*/

export type SlotProps = {
  children?: ReactNode
}

export const Slot = forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props
  const childrenArray = Children.toArray(children)
  const slottable = childrenArray.find(isSlottable)

  if (slottable) {
    // the new element to render is the one passed as a child of `Slottable`
    const newElement = slottable.props.children as ReactNode

    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        // because the new element will be the one rendered, we are only interested
        // in grabbing its children (`newElement.props.children`)
        if (Children.count(newElement) > 1) return Children.only(null)
        return isValidElement(newElement) ? (newElement.props.children as ReactNode) : null
      } else {
        return child
      }
    })

    return (
      <SlotClone {...slotProps} ref={forwardedRef}>
        {isValidElement(newElement) ? cloneElement(newElement, undefined, newChildren) : null}
      </SlotClone>
    )
  }

  return (
    <SlotClone {...slotProps} ref={forwardedRef}>
      {children}
    </SlotClone>
  )
})

Slot.displayName = 'Slot'

/* -------------------------------------------------------------------------------------------------
 * SlotClone
 * -----------------------------------------------------------------------------------------------*/

interface SlotCloneProps {
  children: ReactNode
}

const SlotClone = forwardRef<any, SlotCloneProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props

  if (isValidElement(children)) {
    const childProps = {
      ...mergeSlotProps(children, slotProps),
      ref: composeRefs(forwardedRef, (children as any).ref),
    }
    return cloneElement(children, childProps)
  }

  return Children.count(children) > 1 ? Children.only(null) : null
})

SlotClone.displayName = 'SlotClone'

/* -------------------------------------------------------------------------------------------------
 * Slottable
 * -----------------------------------------------------------------------------------------------*/

export const Slottable = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

/* ---------------------------------------------------------------------------------------------- */

type AnyProps = Record<string, any>

function isSlottable(child: ReactNode): child is ReactElement {
  return isValidElement(child) && child.type === Slottable
}

const pressMap = isWeb
  ? {
      onPress: 'onClick',
      onPressOut: 'onMouseUp',
      onPressIn: 'onMouseDown',
    }
  : {}

function mergeSlotProps(child: any, slotProps: AnyProps) {
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

    if (isHTMLChild && pressMap[propName]) {
      propName = pressMap[propName]
      delete overrideProps[propName]
    }

    const isHandler = handleRegex.test(propName)
    // if it's a handler, modify the override by composing the base handler
    if (isHandler) {
      overrideProps[propName] = mergeEvent(childPropValue, slotPropValue)
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

export function mergeEvent(a?: Function, b?: Function) {
  return (...args: unknown[]) => {
    a?.(...args)
    b?.(...args)
  }
}
