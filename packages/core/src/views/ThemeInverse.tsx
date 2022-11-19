import React from 'react'

import { Theme } from './Theme'

export type ThemeInverseProps = {
  disable?: boolean
}

export const inverseTheme = (themeName: string) => {
  return themeName.startsWith('light')
    ? themeName.replace('light', 'dark')
    : themeName.replace('dark', 'light')
}

export const ThemeInverse = ({
  children,
  disable,
}: ThemeInverseProps & {
  children: React.ReactNode
}) => {
  return <Theme inverse={!disable}>{children}</Theme>
}
