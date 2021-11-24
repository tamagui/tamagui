import React, { isValidElement } from 'react'

export const isTamaguiElement = (child: any): child is React.ReactElement => {
  return isValidElement(child) && !!child.type['staticConfig']?.parsed
}
