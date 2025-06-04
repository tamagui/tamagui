import React from 'react'

import type { UseThemeProps } from './UseThemeProps'

export const ThemeSettingContext: React.Context<UseThemeProps> =
  React.createContext<UseThemeProps>({
    toggle: () => {},
    set: (_) => {},
    themes: [],
  })
