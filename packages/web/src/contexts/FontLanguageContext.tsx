import { createContext } from 'react'

import { LanguageContextType } from '../views/FontLanguage.types'

export const FontLanguageContext = createContext<LanguageContextType | null>(null)
