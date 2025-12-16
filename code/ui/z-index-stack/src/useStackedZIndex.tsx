import { useContext, useEffect, useId, useMemo } from 'react'
import { ZIndexHardcodedContext, ZIndexStackContext } from './context'
import type { StackZIndexProp } from './types'

// this stacks horizontally - just based on which mounted last within a stacking context
const ZIndicesByContext: Record<number, Record<string, number>> = {}

// old stacking style
const CurrentPortalZIndices: Record<string, number> = {}

export const useStackedZIndex = (props: {
  zIndex?: number
  stackZIndex?: StackZIndexProp
}) => {
  if (process.env.TAMAGUI_STACK_Z_INDEX_GLOBAL) {
    const { stackZIndex, zIndex: zIndexProp } = props
    const id = useId()

    const zIndex = useMemo(() => {
      if (stackZIndex && stackZIndex !== 'global' && zIndexProp === undefined) {
        const highest = Object.values(CurrentPortalZIndices).reduce(
          (acc, cur) => Math.max(acc, cur),
          0
        )
        return Math.max(stackZIndex === true ? 1 : stackZIndex, highest + 1)
      }
      return zIndexProp ?? 1000
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
  } else {
    const { stackZIndex, zIndex: zIndexProp } = props
    const id = useId()
    const stackingContextLevel = useContext(ZIndexStackContext)
    const stackLayer = stackZIndex === 'global' ? 0 : stackingContextLevel
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

        const entries = Object.values(stackContext)
        const baseForLayer = stackLayer * 5000
        const nextLayerBase = (stackLayer + 1) * 5000

        // Filter out values that belong to higher layers
        // Any value >= next layer's base is definitely not from this layer
        const validEntries = entries.filter((z) => z < nextLayerBase)

        const highest = validEntries.length > 0 ? Math.max(...validEntries) : baseForLayer

        // If we only have the base value or nothing, start fresh
        const nextZIndex = highest === baseForLayer ? baseForLayer + 1 : highest + 1

        // setting stackZIndex to a number lets you increase it further
        return typeof stackZIndex === 'number' ? stackZIndex + nextZIndex : nextZIndex
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
}
