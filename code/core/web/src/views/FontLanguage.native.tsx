import React from 'react'

import { ComponentContext } from '../contexts/ComponentContext'
import type { FontLanguageProps } from './FontLanguage.types'

export const FontLanguage = ({ children, ...props }: FontLanguageProps) => {
  const parentProps = React.useContext(ComponentContext)
  const language = React.useMemo(() => props, [JSON.stringify(props)])
  return (
    <ComponentContext.Provider {...parentProps} language={language}>
      {children}
    </ComponentContext.Provider>
  )
}

FontLanguage['displayName'] = 'FontLanguage'
