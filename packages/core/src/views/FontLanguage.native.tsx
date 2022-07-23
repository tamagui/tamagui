import React, { useMemo } from 'react'

import { FontLanguageContext } from '../contexts/FontLanguageContext'
import { FontLanguageProps } from './FontLanguage.types'

export const FontLanguage = ({ children, ...props }: FontLanguageProps) => {
  const value = useMemo(() => props, [JSON.stringify(props)])
  return <FontLanguageContext.Provider value={value}>{children}</FontLanguageContext.Provider>
}
