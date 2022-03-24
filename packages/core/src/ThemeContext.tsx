import { createContext } from 'react'

import { ThemeName, Themes } from './types'

export const ThemeContext = createContext<{ themes: Themes; defaultTheme: ThemeName } | null>(null)
