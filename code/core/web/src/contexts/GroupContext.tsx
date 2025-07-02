import { createContext } from 'react'
import type { AllGroupContexts } from '../types'

export const GroupContext = createContext<AllGroupContexts | null>(null)
