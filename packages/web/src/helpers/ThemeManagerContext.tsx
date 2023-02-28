import { createContext } from 'react'

import { ThemeManager } from './ThemeManager.js'

export const ThemeManagerContext = createContext<ThemeManager | null>(null)
