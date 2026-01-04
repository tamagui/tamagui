import { createContext, type Context } from 'react'

import type { UseThemeProps } from './UseThemeProps'

export const ThemeSettingContext: Context<UseThemeProps> = createContext<UseThemeProps>({
  toggle: () => {},
  set: (_) => {},
  themes: [],
})
