import React, { isValidElement } from 'react'

import { StaticConfig } from '../types'
import { isTamaguiComponent } from './isTamaguiComponent'

export type TamaguiElement = Omit<React.ReactElement, 'type'> & {
  type: Function & {
    staticConfig: StaticConfig
  }
}

export const isTamaguiElement = (child: any, name?: string): child is TamaguiElement => {
  return isValidElement(child) && isTamaguiComponent(child.type, name)
}
