import React from 'react'

import { ComponentContext } from '../contexts/ComponentContext'
import type { AnimationDriver } from '../types'

interface ConfigurationProps {
  animationDriver?: AnimationDriver | null
  children: React.ReactNode
}

export const Configuration = (props: ConfigurationProps) => {
  const current = React.useContext(ComponentContext)
  return <ComponentContext.Provider {...current} {...props} />
}

Configuration['displayName'] = 'Configuration'
