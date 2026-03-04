import type { HTMLProps } from 'react'
import type { ElementProps } from './types'

// merges prop getters from multiple interaction hooks.
// event handlers are chained (all run), first non-undefined return value wins.
// non-function props: user props override hook props.
export function useInteractions(propsList: Array<ElementProps | void>) {
  const filtered = propsList.filter(Boolean) as ElementProps[]

  // collect all event handlers by event name for each element type
  const referenceFns = new Map<string, Array<(...args: any[]) => any>>()
  const floatingFns = new Map<string, Array<(...args: any[]) => any>>()
  const itemFns = new Map<string, Array<(...args: any[]) => any>>()

  const referenceStatic: Record<string, any> = {}
  const floatingStatic: Record<string, any> = {}

  for (const props of filtered) {
    if (props.reference) {
      collectProps(props.reference as any, referenceFns, referenceStatic)
    }
    if (props.floating) {
      collectProps(props.floating as any, floatingFns, floatingStatic)
    }
    if (props.item && typeof props.item === 'object') {
      collectProps(props.item as any, itemFns, {})
    }
  }

  return {
    getReferenceProps(userProps?: HTMLProps<Element>) {
      return buildProps(referenceFns, referenceStatic, userProps)
    },
    getFloatingProps(userProps?: HTMLProps<HTMLElement>) {
      return buildProps(floatingFns, floatingStatic, userProps)
    },
    getItemProps(userProps?: HTMLProps<HTMLElement>) {
      return buildProps(itemFns, {}, userProps)
    },
  }
}

function collectProps(
  props: Record<string, any>,
  fnMap: Map<string, Array<(...args: any[]) => any>>,
  staticMap: Record<string, any>
) {
  for (const key of Object.keys(props)) {
    if (typeof props[key] === 'function') {
      let arr = fnMap.get(key)
      if (!arr) {
        arr = []
        fnMap.set(key, arr)
      }
      arr.push(props[key])
    } else {
      staticMap[key] = props[key]
    }
  }
}

function buildProps(
  fnMap: Map<string, Array<(...args: any[]) => any>>,
  staticProps: Record<string, any>,
  userProps?: Record<string, any>
): Record<string, any> {
  // hook static props first, then user props override
  const result: Record<string, any> = { ...staticProps }

  // merge event handlers from hooks
  for (const [key, fns] of fnMap) {
    const hookHandler = (...args: any[]) => {
      for (const fn of fns) {
        const result = fn(...args)
        if (result !== undefined) return result
      }
    }

    result[key] = hookHandler
  }

  // user props override everything — but chain event handlers
  if (userProps) {
    for (const key of Object.keys(userProps)) {
      if (key === 'style') {
        result.style = { ...result.style, ...userProps.style }
      } else if (typeof userProps[key] === 'function' && result[key]) {
        const hookFn = result[key]
        const userFn = userProps[key]
        result[key] = (...args: any[]) => {
          userFn(...args)
          hookFn(...args)
        }
      } else {
        result[key] = userProps[key]
      }
    }
  }

  return result
}
