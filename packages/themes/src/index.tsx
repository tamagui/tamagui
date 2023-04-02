import generatedThemes from './generated'
import { themes as ThemesType } from './themes'

export const themes = generatedThemes as typeof ThemesType

// export * from './themes'
export * from './tokens'
export * from '@tamagui/colors'
