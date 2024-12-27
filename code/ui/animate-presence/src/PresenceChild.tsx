import { useConstant } from '@tamagui/use-constant'
import { PresenceContext } from '@tamagui/use-presence'
import type { PresenceContextProps, PresenceVariantLabels } from '@tamagui/web'
import * as React from 'react'
import { useCallback, useId, useMemo } from 'react'
import { PopChild } from './PopChild'

interface PresenceChildProps {
  children: React.ReactElement
  isPresent: boolean
  onExitComplete?: () => void
  initial?: false | PresenceVariantLabels
  custom?: any
  presenceAffectsLayout: boolean
  mode: 'sync' | 'popLayout' | 'wait'

  // deprecated
  exitVariant?: string | null
  enterVariant?: string | null
  enterExitVariant?: string | null
}

export const PresenceChild = ({
  children,
  initial,
  isPresent,
  onExitComplete,
  custom,
  presenceAffectsLayout,
  mode,
  enterExitVariant,
  enterVariant,
  exitVariant,
}: PresenceChildProps) => {
  const presenceChildren = useConstant(newChildrenMap)
  const id = useId()

  const memoizedOnExitComplete = useCallback(
    (childId: string | number) => {
      presenceChildren.set(`${childId}`, true)

      for (const isComplete of presenceChildren.values()) {
        if (!isComplete) return // can stop searching when any is incomplete
      }

      onExitComplete && onExitComplete()
    },
    [presenceChildren, onExitComplete]
  )

  const context = useMemo(
    (): PresenceContextProps => ({
      id,
      initial,
      isPresent,
      custom,
      enterExitVariant,
      enterVariant,
      exitVariant,
      onExitComplete: memoizedOnExitComplete,
      register: (childId: string | number) => {
        presenceChildren.set(`${childId}`, false)
        return () => presenceChildren.delete(`${childId}`)
      },
    }),
    /**
     * If the presence of a child affects the layout of the components around it,
     * we want to make a new context value to ensure they get re-rendered
     * so they can detect that layout change.
     */
    presenceAffectsLayout
      ? [Math.random(), memoizedOnExitComplete]
      : [isPresent, memoizedOnExitComplete]
  )

  useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false))
  }, [isPresent])

  /**
   * If there's no `motion` components to fire exit animations, we want to remove this
   * component immediately.
   */
  React.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete()
  }, [isPresent])

  if (mode === 'popLayout') {
    children = <PopChild isPresent={isPresent}>{children}</PopChild>
  }

  return <PresenceContext.Provider value={context}>{children}</PresenceContext.Provider>
}

function newChildrenMap(): Map<string, boolean> {
  return new Map()
}
