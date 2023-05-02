import { isValidElement } from 'react'

import { TamaguiReactElement } from '../types'
import { isTamaguiComponent } from './isTamaguiComponent'

export const isTamaguiElement = (
  child: any,
  name?: string
): child is TamaguiReactElement => {
  return isValidElement(child) && isTamaguiComponent(child.type, name)
}
