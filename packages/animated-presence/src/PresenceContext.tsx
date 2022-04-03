import { createContext } from 'react'

import { VariantLabels } from './types'

export interface PresenceContextProps {
  id: string
  isPresent: boolean
  register: (id: string) => () => void
  onExitComplete?: (id: string) => void
  initial?: false | VariantLabels
  custom?: any
}

export const PresenceContext = createContext<PresenceContextProps | null>(null)
