import React, { useEffect } from 'react'

import { ThemeManager, ThemeManagerContext } from '../ThemeManager'

export function wrapThemeManagerContext(children: any, themeManager?: ThemeManager | null) {
  return themeManager ? (
    <ThemeManagerContext.Provider value={themeManager}>{children}</ThemeManagerContext.Provider>
  ) : (
    children
  )
}
