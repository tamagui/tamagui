import { isValidElement } from 'react'

import { StaticConfig } from '../types'
import { isTamaguiComponent } from './isTamaguiComponent'

export const isTamaguiElement = (
  child: any,
  name?: string
): child is React.ReactElement<any> & { type: { staticConfig: StaticConfig } } => {
  return isValidElement(child) && isTamaguiComponent(child.type, name)
}
