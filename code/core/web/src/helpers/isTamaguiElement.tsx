import React from 'react'

import type { StaticConfig } from '../types'
import { isTamaguiComponent } from './isTamaguiComponent'

export const isTamaguiElement = (
  child: any,
  name?: string
): child is React.ReactElement<any> & { type: { staticConfig: StaticConfig } } => {
  return React.isValidElement(child) && isTamaguiComponent(child.type, name)
}
