import { ClientOnly } from '@tamagui/use-did-finish-ssr'
import React from 'react'
import { ComponentContext } from '../contexts/ComponentContext'

interface ConfigurationProps {
  disableSSR?: boolean
  children: React.ReactNode
}

export const Configuration = (props: ConfigurationProps) => {
  const current = React.useContext(ComponentContext)

  return (
    <ClientOnly enabled={props.disableSSR ?? current.disableSSR}>
      <ComponentContext.Provider {...current} {...props} />
    </ClientOnly>
  )
}
