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
