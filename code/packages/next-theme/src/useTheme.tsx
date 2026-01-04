import { useContext } from 'react'

import { ThemeSettingContext } from './ThemeSettingContext'
import type { UseThemeProps } from './UseThemeProps'

/**
 * @deprecated renamed to `useThemeSetting` to avoid confusion with core `useTheme` hook
 */

export const useTheme = (): UseThemeProps => useContext(ThemeSettingContext)

export const useThemeSetting = (): UseThemeProps => useContext(ThemeSettingContext)
