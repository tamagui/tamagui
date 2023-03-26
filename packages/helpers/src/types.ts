export type StyleObject = {
  property: string
  pseudo?: 'hover' | 'focus' | 'active'
  value: string
  identifier: string
  rules: string[]
}

export type MediaStyleObject = Omit<StyleObject, 'value'>
