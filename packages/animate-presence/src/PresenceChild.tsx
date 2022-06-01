import { useConstant, useId } from '@tamagui/core'
import * as React from 'react'

import { AnimatePresenceContext, AnimatePresenceContextProps } from './AnimatePresenceContext'
import { VariantLabels } from './types'

interface PresenceChildProps {
  children: React.ReactElement<any>
  isEntering: boolean | undefined
  onExitComplete?: () => void
  initial?: false | VariantLabels
  exitVariant?: string | null
  enterVariant?: string | null
  presenceAffectsLayout: boolean
}

export const PresenceChild = ({
  children,
  initial,
  isEntering,
  onExitComplete,
  exitVariant,
  enterVariant,
  presenceAffectsLayout,
}: PresenceChildProps) => {
  const presenceChildren = useConstant(newChildrenMap)
  const id = useId() || ''

  const context = React.useMemo(
    (): AnimatePresenceContextProps => {
      return {
        id,
        initial,
        isEntering,
        exitVariant,
        enterVariant,
        onExitComplete: (childId: string) => {
          presenceChildren.set(childId, true)
          for (const isComplete of presenceChildren.values()) {
            if (!isComplete) {
              return // can stop searching when any is incomplete
            }
          }
          onExitComplete?.()
        },
        register: (childId: string) => {
          presenceChildren.set(childId, false)
          return () => presenceChildren.delete(childId)
        },
      }
    },
    /**
     * If the presence of a child affects the layout of the components around it,
     * we want to make a new context value to ensure they get re-rendered
     * so they can detect that layout change.
     */
    presenceAffectsLayout ? undefined : [isEntering, onExitComplete, exitVariant, enterVariant]
  )

  // cant this be a useEffect?
  React.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false))
  }, [isEntering])

  /**
   * If there's no animated components to fire exit animations, we want to remove this
   * component immediately.
   */
  React.useEffect(() => {
    if (isEntering === false && !presenceChildren.size) {
      onExitComplete?.()
    }
  }, [isEntering])

  return (
    <AnimatePresenceContext.Provider value={context}>{children}</AnimatePresenceContext.Provider>
  )
}

function newChildrenMap(): Map<string, boolean> {
  return new Map()
}
