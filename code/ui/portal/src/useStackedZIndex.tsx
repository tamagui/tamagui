import { useEffect, useId, useMemo } from 'react'
import type { PortalProps } from './PortalProps'

const CurrentPortalZIndices: Record<string, number> = {}

export const useStackedZIndex = (props: Pick<PortalProps, 'zIndex' | 'stackZIndex'>) => {
  const { stackZIndex, zIndex: zIndexProp = 1000 } = props
  const id = useId()

  const zIndex = useMemo(() => {
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
  }, [stackZIndex])

  useEffect(() => {
    if (typeof stackZIndex === 'number') {
      CurrentPortalZIndices[id] = stackZIndex
      return () => {
        delete CurrentPortalZIndices[id]
      }
    }
  }, [stackZIndex])

  return zIndex
}
