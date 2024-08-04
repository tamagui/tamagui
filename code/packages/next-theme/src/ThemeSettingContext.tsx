import React from 'react'

import type { UseThemeProps } from './UseThemeProps'

export const ThemeSettingContext = React.createContext<UseThemeProps>({
  toggle: () => {},
  set: (_) => {},
  themes: [],
})
