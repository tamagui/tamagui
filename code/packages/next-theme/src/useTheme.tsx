import React from 'react'

import { ThemeSettingContext } from './ThemeSettingContext'

/**
 * @deprecated renamed to `useThemeSetting` to avoid confusion with core `useTheme` hook
 */

export const useTheme = () => React.useContext(ThemeSettingContext)

export const useThemeSetting = () => React.useContext(ThemeSettingContext)
