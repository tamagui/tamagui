import React from 'react'

import { ComponentContext } from '../contexts/ComponentContext'
import type { FontLanguageProps } from './FontLanguage.types'

export const FontLanguage = ({ children, ...props }: FontLanguageProps) => {
  const language = React.useMemo(() => props, [JSON.stringify(props)])
  return (
    <ComponentContext.Provider language={language}>{children}</ComponentContext.Provider>
  )
}

FontLanguage['displayName'] = 'FontLanguage'
