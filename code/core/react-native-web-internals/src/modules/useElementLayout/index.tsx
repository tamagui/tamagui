import {
  enable,
  useElementLayout as useTamaguiElementLayout,
} from '@tamagui/use-element-layout'
import { type RefObject, useEffect, useMemo } from 'react'
import type { LayoutEvent } from '../../types'

export function useElementLayout(
  ref: RefObject<any>,
  onLayout?: ((e: LayoutEvent) => void) | null
) {
  // translates to tamagui style
  const wrappedRef = useMemo(() => {
    return {
      current: {
        get host() {
          return ref.current
        },
      },
    }
  }, [ref])

  useEffect(() => {
    enable()
  }, [])

  return useTamaguiElementLayout(wrappedRef, onLayout)
}
