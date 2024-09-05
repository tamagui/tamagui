import React from 'react'
import { isWeb } from '@tamagui/constants'

import type { ScaledSize } from 'react-native'
import { Dimensions } from 'react-native'

/**
 * SSR safe useWindowDimensions
 */

type Size = {
  width: number
  height: number
}

const initialValue: Size = {
  height: 800,
  width: 600,
}

export function configureInitialWindowDimensions(next: Size) {
  Object.assign(initialValue, next)
}

Dimensions.addEventListener('change', () => {
  cbs.forEach((cb) => cb(window))
})

const cbs = new Set<Function>()

type WindowSizeListener = ({ window }: { window: ScaledSize }) => void

function subscribe(cb: WindowSizeListener) {
  cbs.add(cb)
  return () => cbs.delete(cb)
}

export function useWindowDimensions({
  serverValue = initialValue,
}: { serverValue?: Size } = {}) {
  return React.useSyncExternalStore(
    subscribe,
    () => Dimensions.get('window'),
    () => (isWeb ? serverValue : Dimensions.get('window'))
  )
}
