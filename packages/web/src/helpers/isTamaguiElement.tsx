import { isValidElement } from 'react'

import { isTamaguiComponent } from './isTamaguiComponent'

export const isTamaguiElement = (
  child: any,
  name?: string
): child is React.ReactElement<any> => {
  return isValidElement(child) && isTamaguiComponent(child.type, name)
}
