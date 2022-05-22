import React, { isValidElement } from 'react'

export const isTamaguiElement = (child: any, name?: string): child is React.ReactElement => {
  const isTamagui = isValidElement(child) && !!child.type['staticConfig']?.parsed
  if (!isTamagui) return false
  if (name) {
    return name === child.type['staticConfig'].componentName
  }
  return true
}
