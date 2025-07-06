import React from 'react'
import { isWeb } from '@tamagui/constants'

import { getWindowSize, subscribe } from './helpers'
import type { WindowSize } from './types'

/**
 * SSR safe useWindowDimensions
 */

const initialValue: WindowSize = {
  width: 800,
  height: 600,
  scale: 1,
  fontScale: 1,
}

export function configureInitialWindowDimensions(next: WindowSize): void {
  Object.assign(initialValue, next)
}

export function useWindowDimensions({
  serverValue = initialValue,
}: { serverValue?: WindowSize } = {}): WindowSize {
  return React.useSyncExternalStore(subscribe, getWindowSize, () =>
    isWeb ? serverValue : getWindowSize()
  )
}
