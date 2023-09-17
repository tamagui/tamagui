import { useMemo } from 'react'

import { ComponentContext } from '../contexts/ComponentContext'
import type { FontLanguageProps } from './FontLanguage.types'

export const FontLanguage = ({ children, ...props }: FontLanguageProps) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const language = useMemo(() => props, [JSON.stringify(props)])
  return (
    <ComponentContext.Provider language={language}>{children}</ComponentContext.Provider>
  )
}
