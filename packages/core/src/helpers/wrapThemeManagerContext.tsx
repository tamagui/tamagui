import React from 'react'

import { ThemeManager, ThemeManagerContext } from '../ThemeManager'
import { Theme } from '../views/Theme'

export function wrapThemeManagerContext(
  children: any,
  themeManager?: ThemeManager | null,
  shouldSetChildrenThemeToParent?: boolean
) {
  return themeManager ? (
    <ThemeManagerContext.Provider value={themeManager}>
      {shouldSetChildrenThemeToParent ? (
        <Theme name={themeManager.parentName}>{children}</Theme>
      ) : (
        children
      )}
    </ThemeManagerContext.Provider>
  ) : (
    children
  )
}
