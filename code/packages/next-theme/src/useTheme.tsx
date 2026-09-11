import { useContext } from 'react'

import { ThemeSettingContext } from './ThemeSettingContext'
import type { UseThemeProps } from './UseThemeProps'

export const useThemeSetting = (): UseThemeProps => useContext(ThemeSettingContext)
