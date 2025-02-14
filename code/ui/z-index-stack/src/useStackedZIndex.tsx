import { useContext, useEffect, useId, useMemo } from 'react'
import { ZIndexStackContext } from './context'

// this stacks horizontally - just based on which mounted last within a stacking context
const ZIndicesByContext: Record<number, Record<string, number>> = {}

export const useStackedZIndex = (props: {
  zIndex?: number
  stackZIndex?: boolean | number
}) => {
  const { stackZIndex, zIndex: zIndexProp } = props
  const id = useId()
  const stackingContextLevel = useContext(ZIndexStackContext)

  ZIndicesByContext[stackingContextLevel] ||= {}
  const stackContext = ZIndicesByContext[stackingContextLevel]

  const zIndex = useMemo(() => {
    if (stackZIndex) {
      const highest = Object.values(stackContext).reduce(
        (acc, cur) => Math.max(acc, cur),
        0
      )

      // each context level elevates 5k
      const found = stackingContextLevel * 5000 + highest + 1

      // setting stackZIndex to a number lets you increase it further
      return typeof stackZIndex === 'number' ? stackZIndex + found : found
    }
    if (zIndexProp) {
      return zIndexProp
    }
    return 1
  }, [stackZIndex])

  useEffect(() => {
    if (stackZIndex) {
      stackContext[id] = zIndex
      return () => {
        delete stackContext[id]
      }
    }
  }, [stackZIndex])

  return zIndex
}
