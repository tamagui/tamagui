import type React from 'react'

import type { FontLanguages, FontTokens } from '../types'

type FontFamilies = FontTokens extends `$${infer Token}` ? Token : never

export type LanguageContextType = Partial<{
  [key in FontFamilies]: FontLanguages | 'default'
}>

export type FontLanguageProps = LanguageContextType & {
  children?: React.ReactNode
}
