import { createContext } from 'react'

import { VariantLabels } from './types'

export interface AnimatePresenceContextProps {
  id: string
  isEntering: boolean | undefined
  register: (id: string) => () => void
  onExitComplete?: (id: string) => void
  initial?: false | VariantLabels
  exitVariant?: string | null
  enterVariant?: string | null
}

export const AnimatePresenceContext = createContext<AnimatePresenceContextProps | null>(null)
