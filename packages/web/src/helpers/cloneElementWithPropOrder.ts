import { cloneElement } from 'react'

import { getConfig } from '../config'
import { mergeProps } from './mergeProps'

export const cloneElementWithPropOrder = (child: any, props: Object) => {
  const next = mergeProps(child.props, props, getConfig().shorthands)
  return cloneElement({ ...child, props: null }, next)
}
