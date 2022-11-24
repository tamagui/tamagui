import { createContext } from 'react'

import { ThemeManager } from './ThemeManager'

export const ThemeManagerContext = createContext<ThemeManager | null>(null)
