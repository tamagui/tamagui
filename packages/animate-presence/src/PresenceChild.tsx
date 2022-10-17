import { PresenceContext, PresenceContextProps } from '@tamagui/use-presence'
import * as React from 'react'
import { useId } from 'react'

import { VariantLabels } from './types'

interface PresenceChildProps {
  children: React.ReactElement<any>
  isPresent: boolean
  onExitComplete?: () => void
  initial?: false | VariantLabels
  custom?: any
  presenceAffectsLayout: boolean
  exitVariant?: string | null
  enterVariant?: string | null
}

export const PresenceChild = ({
  children,
  initial,
  isPresent,
  onExitComplete,
  exitVariant,
  enterVariant,
  presenceAffectsLayout,
}: PresenceChildProps) => {
  const presenceChildren = React.useMemo(newChildrenMap, [])
  const id = useId() || ''

  const context = React.useMemo(
    (): PresenceContextProps => {
      return {
        id,
        initial,
        isPresent,
        exitVariant,
        enterVariant,
        onExitComplete: (id: string) => {
          presenceChildren.set(id, true)
          for (const isComplete of presenceChildren.values()) {
            if (!isComplete) {
              return // can stop searching when any is incomplete
            }
          }
          onExitComplete?.()
        },
        register: (id: string) => {
          presenceChildren.set(id, false)
          return () => presenceChildren.delete(id)
        },
      }
    },
    /**
     * If the presence of a child affects the layout of the components around it,
     * we want to make a new context value to ensure they get re-rendered
     * so they can detect that layout change.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    presenceAffectsLayout ? undefined : [isPresent, exitVariant, enterVariant]
  )

  React.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresent])

  /**
   * If there's no animated components to fire exit animations, we want to remove this
   * component immediately.
   */
  React.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresent])

  return <PresenceContext.Provider value={context}>{children}</PresenceContext.Provider>
}

function newChildrenMap(): Map<string, boolean> {
  return new Map()
}
