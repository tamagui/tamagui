import { getConfig } from '../config'
import type { StaticConfig } from '../types'

// merge both default props, styled context props, and default text props
export const getDefaultProps = (
  staticConfig: StaticConfig,
  propsComponentName?: string,
  isSubText?: boolean
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
    defaultProps = { ...userDefaultProps, ...defaultProps }
  }

  if (process.env.TAMAGUI_TARGET === 'web' && isSubText) {
    // for nested text, inherit from parent unless component explicitly set a fontFamily
    // staticConfig.defaultProps contains explicit component defaults (e.g., SizableText sets $body)
    // userDefaultProps contains global config defaults - these should be overridden for nested text
    const hasExplicitFontFamily = staticConfig?.defaultProps?.fontFamily
    defaultProps = { ...defaultProps }
    if (!hasExplicitFontFamily) defaultProps.fontFamily = 'inherit'
    if (!defaultProps.color) defaultProps.color = 'inherit'
    if (defaultProps.whiteSpace === 'pre-wrap') defaultProps.whiteSpace = 'inherit'
    if (defaultProps.wordWrap === 'break-word') defaultProps.wordWrap = 'inherit'
  }

  return defaultProps
}
