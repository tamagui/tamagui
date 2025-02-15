import { useContext, useEffect, useId, useMemo } from 'react'
import { ZIndexHardcodedContext, ZIndexStackContext } from './context'

// this stacks horizontally - just based on which mounted last within a stacking context
const ZIndicesByContext: Record<number, Record<string, number>> = {}

export const useStackedZIndex = (props: {
  zIndex?: number
  stackZIndex?: boolean | number
}) => {
  const { stackZIndex, zIndex: zIndexProp } = props
  const id = useId()
  const stackingContextLevel = useContext(ZIndexStackContext)
  const hardcoded = useContext(ZIndexHardcodedContext)

  ZIndicesByContext[stackingContextLevel] ||= {}
  const stackContext = ZIndicesByContext[stackingContextLevel]

  const zIndex = useMemo(() => {
    if (typeof zIndexProp === 'number') {
      return zIndexProp
    }
    if (stackZIndex) {
      if (hardcoded) {
        return hardcoded + 1
      }

      const highest = Object.values(stackContext).reduce(
        (acc, cur) => Math.max(acc, cur),
        0
      )

      // each context level elevates 5k
      const found = stackingContextLevel * 5000 + highest + 1

      // setting stackZIndex to a number lets you increase it further
      return typeof stackZIndex === 'number' ? stackZIndex + found : found
    }

    return 1
  }, [stackingContextLevel, zIndexProp, stackZIndex])

  useEffect(() => {
    if (stackZIndex) {
      stackContext[id] = zIndex
      return () => {
        delete stackContext[id]
      }
    }
  }, [zIndex])

  return zIndex
}
