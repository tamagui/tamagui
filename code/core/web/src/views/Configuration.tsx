import { ClientOnly, ClientOnlyContext } from '@tamagui/use-did-finish-ssr'
import React, { useContext } from 'react'
import { ComponentContext } from '../contexts/ComponentContext'
import type { AnimationDriver } from '../types'

interface ConfigurationProps {
  animationDriver?: AnimationDriver | null
  disableSSR?: boolean
  children: React.ReactNode
}

export const Configuration = (props: ConfigurationProps) => {
  const current = React.useContext(ComponentContext)
  const clientOnly = useContext(ClientOnlyContext)

  const children = <ComponentContext.Provider {...current} {...props} />

  if (clientOnly) {
    return <ClientOnly>{children}</ClientOnly>
  }

  return children
}

Configuration['displayName'] = 'Configuration'
