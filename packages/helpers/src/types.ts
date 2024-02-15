export type StyleObject = {
  property: string
  pseudo?: 'hover' | 'focus' | 'focus-visible' | 'active'
  identifier: string
  rules: string[]

  // only in test mode
  value?: any
}

export type MediaStyleObject = Omit<StyleObject, 'value'>
