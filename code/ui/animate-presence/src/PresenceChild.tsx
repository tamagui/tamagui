import { useConstant } from '@tamagui/use-constant'
import { PresenceContext } from '@tamagui/use-presence'
import type { PresenceContextProps } from '@tamagui/web'
import * as React from 'react'
import { useId } from 'react'

import type { VariantLabels } from './types'

interface PresenceChildProps {
  children: React.ReactElement<any>
  isPresent: boolean
  onExitComplete?: () => void
  initial?: false | VariantLabels
  custom?: any
  presenceAffectsLayout: boolean
  exitVariant?: string | null
  enterVariant?: string | null
  enterExitVariant?: string | null
}

// this memo seems to help PopoverContent from continuously re-rendering when open
export const PresenceChild = React.memo(
  ({
    children,
    initial,
    isPresent,
    onExitComplete,
    exitVariant,
    enterVariant,
    enterExitVariant,
    presenceAffectsLayout,
    custom,
  }: PresenceChildProps) => {
    const presenceChildren = useConstant(newChildrenMap)
    const id = useId() || ''

    const context = React.useMemo(
      (): PresenceContextProps => {
        return {
          id,
          initial,
          isPresent,
          custom,
          exitVariant,
          enterVariant,
          enterExitVariant,
          onExitComplete: () => {
            presenceChildren.set(id, true)
            for (const isComplete of presenceChildren.values()) {
              if (!isComplete) {
                return // can stop searching when any is incomplete
              }
            }
            onExitComplete?.()
          },
          register: () => {
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

      // @ts-expect-error its ok
      presenceAffectsLayout ? undefined : [isPresent, exitVariant, enterVariant]
    )

    React.useMemo(() => {
      presenceChildren.forEach((_, key) => presenceChildren.set(key, false))
    }, [isPresent])

    /**
     * If there's no animated components to fire exit animations, we want to remove this
     * component immediately.
     */
    React.useEffect(() => {
      !isPresent && !presenceChildren.size && onExitComplete?.()
    }, [isPresent])

    return <PresenceContext.Provider value={context}>{children}</PresenceContext.Provider>
  }
)

function newChildrenMap(): Map<string, boolean> {
  return new Map()
}
