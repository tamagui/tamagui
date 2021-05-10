export interface ThemeObject {
  [key: string]: any
}

export interface Themes {
  [key: string]: ThemeObject
}

export type ThemeName = keyof Themes
