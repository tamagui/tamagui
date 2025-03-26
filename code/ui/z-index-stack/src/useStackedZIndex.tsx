import { useContext, useEffect, useId, useMemo } from 'react'
import { ZIndexHardcodedContext, ZIndexStackContext } from './context'
import type { StackZIndexProp } from './types'

// this stacks horizontally - just based on which mounted last within a stacking context
const ZIndicesByContext: Record<number, Record<string, number>> = {}

export const useStackedZIndex = (props: {
  zIndex?: number
  stackZIndex?: StackZIndexProp
}) => {
  const { stackZIndex, zIndex: zIndexProp } = props
  const id = useId()
  const stackingContextLevel = useContext(ZIndexStackContext)
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b6dc1752d7 (adds TAMAGUI_STACK_Z_INDEX_GLOBAL option to bail out of new z-index stacking method)
  const stackLayer =
    process.env.TAMAGUI_STACK_Z_INDEX_GLOBAL || stackZIndex === 'global'
      ? 0
      : stackingContextLevel
<<<<<<< HEAD
=======
  const stackLayer = stackZIndex === 'global' ? 0 : stackingContextLevel
>>>>>>> f2dac909d9 (feat(z-index-stack): adds "global" option to stackZIndex prop that avoids nesting z-index stacking, keeping older behavior)
=======
>>>>>>> b6dc1752d7 (adds TAMAGUI_STACK_Z_INDEX_GLOBAL option to bail out of new z-index stacking method)
  const hardcoded = useContext(ZIndexHardcodedContext)

  ZIndicesByContext[stackLayer] ||= {}
  const stackContext = ZIndicesByContext[stackLayer]

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
      const found = stackLayer * 5000 + highest + 1

      // setting stackZIndex to a number lets you increase it further
      return typeof stackZIndex === 'number' ? stackZIndex + found : found
    }

    return 1
  }, [stackLayer, zIndexProp, stackZIndex])

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
