import type { PresenceContextProps } from '@tamagui/core'
import { createContext } from 'react'

export const PresenceContext = createContext<PresenceContextProps | null>(null)
