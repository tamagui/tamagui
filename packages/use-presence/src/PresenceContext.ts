import type { PresenceContextProps } from '@tamagui/web'
import { createContext } from 'react'

export const PresenceContext = createContext<PresenceContextProps | null>(null)
