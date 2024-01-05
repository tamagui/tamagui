import { getConfig } from '../config'
import { ComponentContextI } from '../types'

export function getDisableSSR(componentContext?: ComponentContextI) {
  return componentContext?.disableSSR ?? getConfig().disableSSR
}
