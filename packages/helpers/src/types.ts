export type StyleObject = {
  property: string
  pseudo?: 'hover' | 'focus' | 'active'
  value: string
  className: string
  identifier: string
  rules: string[]
}
