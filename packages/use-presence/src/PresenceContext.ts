import { createContext } from 'react'

export interface PresenceContextProps {
  id: string
  isPresent: boolean
  register: (id: string) => () => void
  onExitComplete?: (id: string) => void
  initial?: false | string | string[]
  custom?: any
  exitVariant?: string | null
  enterVariant?: string | null
}

export const PresenceContext = createContext<PresenceContextProps | null>(null)
