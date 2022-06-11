import React, { isValidElement } from 'react'

import { isTamaguiComponent } from './isTamaguiComponent'

export const isTamaguiElement = (child: any, name?: string): child is React.ReactElement => {
  return isValidElement(child) && isTamaguiComponent(child.type, name)
}
