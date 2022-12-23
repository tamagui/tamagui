import React, { isValidElement } from 'react'

import { TamaguiComponent } from '../types'
import { isTamaguiComponent } from './isTamaguiComponent'

export type TamaguiReactElement<P = any> = React.ReactElement<P> & {
  type: TamaguiComponent
}

export const isTamaguiElement = (
  child: any,
  name?: string
): child is TamaguiReactElement => {
  return isValidElement(child) && isTamaguiComponent(child.type, name)
}
