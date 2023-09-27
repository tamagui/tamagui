import { useContext } from 'react'

import { getConfig } from '../config'
import { ComponentContext } from '../contexts/ComponentContext'
import { ComponentContextI } from '../types'

export function useDisableSSR() {
  const componentContext = useContext(ComponentContext)
  return getDisableSSR(componentContext)
}

export function getDisableSSR(componentContext: ComponentContextI) {
  return componentContext.disableSSR ?? getConfig().disableSSR
}
