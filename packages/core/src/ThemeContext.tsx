import { createContext } from 'react'

import { Themes } from './types'

export const ThemeContext = createContext<Themes>(null as any)
