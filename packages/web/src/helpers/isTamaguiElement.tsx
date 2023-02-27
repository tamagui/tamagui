import { isValidElement } from 'react'

import { TamaguiReactElement } from '../types.js'
import { isTamaguiComponent } from './isTamaguiComponent.js'

export const isTamaguiElement = (
  child: any,
  name?: string
): child is TamaguiReactElement => {
  return isValidElement(child) && isTamaguiComponent(child.type, name)
}
