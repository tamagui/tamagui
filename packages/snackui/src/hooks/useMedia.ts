import { isEqual } from '@o/fast-compare'
import { debounce } from 'lodash'
import React, { DependencyList, EffectCallback } from 'react'

import { weakKey } from '../helpers/weakKey'

const { useState, useEffect, useLayoutEffect } = React

type MediaQueryObject = { [key: string]: string | number | boolean }

const camelToHyphen = (str: string) =>
  str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`).toLowerCase()

export const mediaObjectToString = (query: string | MediaQueryObject) => {
  if (typeof query === 'string') return query
  return Object.entries(query)
    .map(([feature, value]) => {
      feature = camelToHyphen(feature)
      if (typeof value === 'boolean') {
        return value ? feature : `not ${feature}`
      }
      if (typeof value === 'number' && /[height|width]$/.test(feature)) {
        value = `${value}px`
      }
      return `(${feature}: ${value})`
    })
    .join(' and ')
}

type MediaQueryShort = string | MediaQueryObject

export type UseMediaOptions<A> = {
  onChange?: (val?: A extends any[] ? boolean[] : boolean) => any
}

// use array if given array
const normalizeState = (queryState: boolean[], originalQueries: any) => {
  return Array.isArray(originalQueries) ? queryState : queryState[0]
}

type EitherEffect = (effect: EffectCallback, deps?: DependencyList) => void

const createUseMedia = (effect: EitherEffect) =>
  function useMedia<A extends MediaQueryShort | MediaQueryShort[]>(
    rawQueries: A,
    options?: UseMediaOptions<A>
  ): A extends any[] ? boolean[] : boolean {
    // ssr ignore
    if (
      typeof window == 'undefined' ||
      typeof window.matchMedia === 'undefined'
    ) {
      return false as any
    }

    // @ts-ignore
    const allQueries = [].concat(rawQueries)
    const queries = allQueries.map(mediaObjectToString)
    const [state, setState] = useState(
      normalizeState(
        queries.map((query) => !!window.matchMedia(query).matches),
        rawQueries
      )
    )

    effect(() => {
      let mounted = true
      const mqls = queries.map((query) => window.matchMedia(query))

      let last
      const update = () => {
        const next = normalizeState(
          mqls.map((x) => !!x.matches),
          rawQueries
        )
        if (!isEqual(next, last)) {
          last = next
          if (options && options.onChange) {
            options.onChange(next as any)
          } else {
            setState(next)
          }
        }
      }

      const onChange = () => {
        if (!mounted) return
        update()
      }

      mqls.forEach((mql) => mql.addListener(onChange))
      update()

      return () => {
        mounted = false
        mqls.forEach((x) => x.removeListener(onChange))
      }
    }, [weakKey(rawQueries)])

    return state as any
  }

export const useMedia = createUseMedia(useEffect)
export const useMediaLayout = createUseMedia(useLayoutEffect)
