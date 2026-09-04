import { useCallback, useMemo } from 'react'
import type { HTMLProps } from 'react'
import type { ElementProps } from './types'

type PropGetter = (userProps?: Record<string, any>) => Record<string, any>

// merges prop getters from multiple interaction hooks.
// event handlers are chained (all run), first non-undefined return value wins.
// non-function props: user props override hook props.
//
// the getters are memoized on the hook outputs so a consumer can hold the
// result in context: every interaction hook memoizes its props, so a render
// that changes none of them keeps the same getters
export function useInteractions(propsList: Array<ElementProps | void>) {
  const referenceDeps = propsList.map((props) => props?.reference)
  const floatingDeps = propsList.map((props) => props?.floating)
  const itemDeps = propsList.map((props) => props?.item)

  const getReferenceProps = useCallback<PropGetter>(
    (userProps) => mergeProps(referenceDeps, userProps),
    referenceDeps
  )
  const getFloatingProps = useCallback<PropGetter>(
    (userProps) => mergeProps(floatingDeps, userProps),
    floatingDeps
  )
  const getItemProps = useCallback<PropGetter>(
    (userProps) => mergeProps(itemDeps, userProps, true),
    itemDeps
  )

  return useMemo(
    () => ({
      getReferenceProps: getReferenceProps as (
        userProps?: HTMLProps<Element>
      ) => Record<string, any>,
      getFloatingProps: getFloatingProps as (
        userProps?: HTMLProps<HTMLElement>
      ) => Record<string, any>,
      getItemProps: getItemProps as (
        userProps?: HTMLProps<HTMLElement>
      ) => Record<string, any>,
    }),
    [getReferenceProps, getFloatingProps, getItemProps]
  )
}

function mergeProps(
  list: Array<Record<string, any> | ((...args: any[]) => any) | void>,
  userProps?: Record<string, any>,
  objectsOnly = false
): Record<string, any> {
  const fnMap = new Map<string, Array<(...args: any[]) => any>>()
  // hook static props first, then user props override
  const result: Record<string, any> = {}

  for (const props of list) {
    if (!props || (objectsOnly && typeof props !== 'object')) continue
    for (const key of Object.keys(props)) {
      const value = (props as Record<string, any>)[key]
      if (typeof value === 'function') {
        let arr = fnMap.get(key)
        if (!arr) {
          arr = []
          fnMap.set(key, arr)
        }
        arr.push(value)
      } else {
        result[key] = value
      }
    }
  }

  // merge event handlers from hooks
  for (const [key, fns] of fnMap) {
    result[key] = (...args: any[]) => {
      for (const fn of fns) {
        const out = fn(...args)
        if (out !== undefined) return out
      }
    }
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
