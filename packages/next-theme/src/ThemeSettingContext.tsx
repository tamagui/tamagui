import { createContext } from 'react'

import { UseThemeProps } from './UseThemeProps'

export const ThemeSettingContext = createContext<UseThemeProps>({
  toggle: () => {},
  set: (_) => {},
  themes: [],
})
