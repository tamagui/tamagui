import type { ThemeSuiteItem } from '@tamagui/theme-builder'

type Component = (props?: any) => any

export type SectionStep = {
  subTitle: string
  tip?: Component
  sidebar?: Component
  children: Component
  actions?: Component
  tray?: Component
  preview?: Component
  showInline?: boolean
  nextTitle?: string
  prevTitle?: string
  explanation?: boolean
  /**
   * should we save the data when they finish the current step and go to next
   */
  saveOnNext?: boolean
  /**
   * shows a tooltip on theme switch
   */
  themeSwitchTip?: string
}

export type ThemeStudioSection = {
  title: string
  id: 'scheme' | 'base' | 'sub' | 'component' | 'export'
  steps: SectionStep[]
  loadData?: (data: any) => Promise<void>
  exportData?: () => any
}

type IfEquals<X, Y, A, B> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? A
  : B

export type WritableKeysOf<T> = {
  [P in keyof T]: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P, never>
}[keyof T]

export type ThemeBuilderState = {
  themeSuites: {
    [id: string]: ThemeSuiteItem
  }
}

export type ThemeSuiteItemData = Omit<ThemeSuiteItem, 'id' | 'createdAt' | 'updatedAt'>

export type ScaleTypeName =
  | 'custom'
  | 'radix'
  | 'radix-b'
  | 'radius-bold'
  | 'radius-bright'
  | 'linear'
  | 'pastel'
  | 'pastel-desaturating'
  | 'neon'
  | 'neon-bright'
  | 'neon-c'

export type BuildThemeBase = {
  id: string
  name: string
  errors?: string[]
}

export type BuildTheme = BuildThemeBase & {
  type: 'theme'
  template: string
  palette: string
  accent?: BuildTheme
}
