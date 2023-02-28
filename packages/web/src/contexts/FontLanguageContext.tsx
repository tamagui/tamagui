import { createContext } from 'react'

import type { LanguageContextType } from '../views/FontLanguage.types.js'

export const FontLanguageContext = createContext<LanguageContextType | null>(null)
