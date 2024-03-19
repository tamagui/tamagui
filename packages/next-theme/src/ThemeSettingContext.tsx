import { createContext } from 'react'

import type { UseThemeProps } from './UseThemeProps'

export const ThemeSettingContext = createContext<UseThemeProps>({
  toggle: () => {},
  set: (_) => {},
  themes: [],
})
