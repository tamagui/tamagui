import { getConfig } from '../config'
import type { ComponentContextI } from '../types'

export function getDisableSSR(componentContext?: ComponentContextI) {
  return (
    componentContext?.disableSSR ??
    (getConfig().settings.disableSSR || getConfig().disableSSR)
  )
}
