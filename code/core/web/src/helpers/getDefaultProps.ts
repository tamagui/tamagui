import { getConfig } from '../config'
import type { StaticConfig } from '../types'

// merge both default props, styled context props, and default text props
export const getDefaultProps = (
  staticConfig: StaticConfig,
  propsComponentName?: string
) => {
  let defaultProps = staticConfig?.defaultProps

  const conf = getConfig()
  const name =
    propsComponentName ||
    staticConfig?.componentName ||
    // important: this is how we end up getting the defaultProps we set in createTamagui
    (staticConfig.isText ? 'Text' : 'View')

  const userDefaultProps = conf?.defaultProps?.[name]

  if (userDefaultProps) {
    // component's staticConfig.defaultProps wins over global config defaults
    defaultProps = defaultProps
      ? { ...userDefaultProps, ...defaultProps }
      : userDefaultProps
  }

  return defaultProps
}
