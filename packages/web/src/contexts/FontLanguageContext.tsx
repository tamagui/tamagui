import { createContext } from 'react'

import type { LanguageContextType } from '../views/FontLanguage.types'

export const FontLanguageContext = createContext<LanguageContextType | null>(null)
