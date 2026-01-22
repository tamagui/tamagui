import { getConfig } from '../config'
import type { StaticConfig } from '../types'

export const getUserDefaultProps = (
  props?: Record<string, any>,
  staticConfig?: StaticConfig
) => {
  const conf = getConfig()
  const name = props?.componentName || staticConfig?.componentName
  if (name) {
    const userDefaultProps = conf?.defaultProps?.[name]
    return userDefaultProps
  }
}
