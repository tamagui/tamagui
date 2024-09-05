import type { ComputePositionReturn } from '@floating-ui/react-native'
import type { RefObject } from 'react'

export const autoUpdate = () => {}

export * from '@floating-ui/react-native'

export const platform = null

export declare type UseFloatingReturn = Data & {
  update: () => void
  offsetParent: (node: any) => void
  floating: (node: any) => void
  reference: (node: any) => void
  refs: {
    reference: RefObject<any>
    floating: RefObject<any>
    offsetParent: RefObject<any>
    setReference: (node: any) => void
    setFloating: (node: any) => void
    setOffsetParent: (node: any) => void
  }
  elements: {
    reference: any
    floating: any
    offsetParent: any
  }
  scrollProps: {
    onScroll: (event: {
      nativeEvent: {
        contentOffset: {
          x: number
          y: number
        }
      }
    }) => void
    scrollEventThrottle: 16
  }
}

type Data = Omit<ComputePositionReturn, 'x' | 'y'> & {
  x: number | null
  y: number | null
}
