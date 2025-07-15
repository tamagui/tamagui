import React from 'react'
import { isWeb } from '@tamagui/constants'

import { getWindowSize, subscribe } from './helpers'
import type { WindowSize } from './types'
import { initialValue } from './initialValue'

export { configureInitialWindowDimensions } from './initialValue'

export function useWindowDimensions({
  serverValue = initialValue,
}: { serverValue?: WindowSize } = {}): WindowSize {
  return React.useSyncExternalStore(subscribe, getWindowSize, () =>
    isWeb ? serverValue : getWindowSize()
  )
}
