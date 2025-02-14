import { useContext, useEffect, useId, useMemo } from 'react'
import { ZIndexStackContext } from './context'

// this stacks horizontally - just based on which mounted last within a stacking context
const ZIndicesByContext: Record<number, Record<string, number>> = {}

export const useStackedZIndex = (props: { zIndex?: number; stackZIndex?: number }) => {
  const { stackZIndex, zIndex: zIndexProp = 1000 } = props
  const id = useId()
  const context = useContext(ZIndexStackContext)
  ZIndicesByContext[context] ||= {}
  const stackContext = ZIndicesByContext[context]

  const zIndex = useMemo(() => {
    if (stackZIndex) {
      const highest = Object.values(stackContext).reduce(
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
      stackContext[id] = stackZIndex
      return () => {
        delete stackContext[id]
      }
    }
  }, [stackZIndex])

  return zIndex
}
