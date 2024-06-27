import { useContext } from 'react'

import { ThemeSettingContext } from './ThemeSettingContext'

/**
 * @deprecated renamed to `useThemeSetting` to avoid confusion with core `useTheme` hook
 */

export const useTheme = () => useContext(ThemeSettingContext)

export const useThemeSetting = () => useContext(ThemeSettingContext)
