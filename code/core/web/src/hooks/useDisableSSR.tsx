import { getSetting } from '../config'
import type { ComponentContextI } from '../types'

export function getDisableSSR(componentContext?: ComponentContextI) {
  return componentContext?.disableSSR ?? getSetting('disableSSR')
}
