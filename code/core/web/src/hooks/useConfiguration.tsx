import React from 'react'

import { getConfig } from '../config'
import { ComponentContext } from '../contexts/ComponentContext'

export const useConfiguration = () => {
  const { groups, animationDriver, ...restComponentConfig } =
    React.useContext(ComponentContext)
  const { animations, ...restConfig } = getConfig()
  return {
    ...restConfig,
    ...restComponentConfig,
    animationDriver: animationDriver ?? getConfig().animations,
  }
}
