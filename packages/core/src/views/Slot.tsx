// via radix

import { composeRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import * as React from 'react'

/* -------------------------------------------------------------------------------------------------
 * Slot
 * -----------------------------------------------------------------------------------------------*/

export type SlotProps = {
  children?: React.ReactNode
}

export const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props
  const childrenArray = React.Children.toArray(children)
  const slottable = childrenArray.find(isSlottable)

  if (slottable) {
    // the new element to render is the one passed as a child of `Slottable`
    const newElement = slottable.props.children as React.ReactNode

    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        // because the new element will be the one rendered, we are only interested
        // in grabbing its children (`newElement.props.children`)
        if (React.Children.count(newElement) > 1) return React.Children.only(null)
        return React.isValidElement(newElement)
          ? (newElement.props.children as React.ReactNode)
          : null
      } else {
        return child
      }
    })

    return (
      <SlotClone {...slotProps} ref={forwardedRef}>
        {React.isValidElement(newElement)
          ? React.cloneElement(newElement, undefined, newChildren)
          : null}
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
  children: React.ReactNode
}

const SlotClone = React.forwardRef<any, SlotCloneProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props

  if (React.isValidElement(children)) {
    const childProps = {
      ...mergeSlotProps(children, slotProps),
      ref: composeRefs(forwardedRef, (children as any).ref),
    }
    return React.cloneElement(children, childProps)
  }

  return React.Children.count(children) > 1 ? React.Children.only(null) : null
})

SlotClone.displayName = 'SlotClone'

/* -------------------------------------------------------------------------------------------------
 * Slottable
 * -----------------------------------------------------------------------------------------------*/

export const Slottable = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

/* ---------------------------------------------------------------------------------------------- */

type AnyProps = Record<string, any>

function isSlottable(child: React.ReactNode): child is React.ReactElement {
  return React.isValidElement(child) && child.type === Slottable
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
