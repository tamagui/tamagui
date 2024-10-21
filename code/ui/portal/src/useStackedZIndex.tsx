import { useEffect, useId } from 'react'
import type { PortalProps } from './PortalProps'

const CurrentPortalZIndices: Record<string, number> = {}

export const useStackedZIndex = (props: Pick<PortalProps, 'zIndex' | 'stackZIndex'>) => {
  const { stackZIndex, zIndex: zIndexProp = 1000 } = props

  const zIndex = (() => {
    if (stackZIndex) {
      const highest = Object.values(CurrentPortalZIndices).reduce(
        (acc, cur) => Math.max(acc, cur),
        0
      )
      return Math.max(stackZIndex, highest + 1)
    }
    if (zIndexProp) {
      return zIndexProp
    }
  })()

  const id = useId()

  useEffect(() => {
    if (typeof zIndex === 'number') {
      CurrentPortalZIndices[id] = zIndex
      return () => {
        delete CurrentPortalZIndices[id]
      }
    }
  }, [zIndex])

  return zIndex
}
