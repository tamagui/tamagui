export type StyleObject = [
  property: string,
  value: any,
  identifier: string,
  pseudo: 'hover' | 'focus' | 'focus-visible' | 'focus-within' | 'active' | undefined,
  rules: string[],
]

export const StyleObjectProperty = 0
export const StyleObjectValue = 1
export const StyleObjectIdentifier = 2
export const StyleObjectPseudo = 3
export const StyleObjectRules = 4

export type MediaStyleObject = Omit<StyleObject, 'value'>
