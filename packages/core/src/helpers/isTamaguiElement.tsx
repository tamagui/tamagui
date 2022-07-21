import React, { isValidElement } from 'react'

import { StaticConfig } from '../types'
import { isTamaguiComponent } from './isTamaguiComponent'

export type TamaguiReactElement = React.ReactElement & {
  type: {
    staticConfig: StaticConfig
  }
}

export const isTamaguiElement = (child: any, name?: string): child is TamaguiReactElement => {
  return isValidElement(child) && isTamaguiComponent(child.type, name)
}
