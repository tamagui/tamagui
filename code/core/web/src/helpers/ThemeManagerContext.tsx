import React from 'react'
import type { ThemeManager } from './ThemeManager'

export const ThemeManagerContext = React.createContext<ThemeManager | null>(null)
