import { TextStyle, ViewStyle } from 'react-native'

export type StaticComponent<A> = ((props: A) => JSX.Element) & {
  staticConfig: StaticConfig
}

// duplicate of ui-static, we need shared types..
export type StaticConfig = {
  validStyles?: { [key: string]: boolean }
  defaultProps?: any
  expansionProps?: {
    [key: string]:
      | ViewStyle
      | TextStyle
      | ((props: any) => ViewStyle | TextStyle)
  }
}

export function extendStaticConfig(a: any, config: StaticConfig) {
  if (process.env.TARGET === 'client') {
    return
  }
  if (!a.staticConfig) {
    throw new Error(`No static config: ${a} ${JSON.stringify(config)}`)
  }
  return {
    validStyles: {
      ...a.staticConfig.validStyles,
      ...config.validStyles,
    },
    defaultProps: {
      ...a.staticConfig.defaultProps,
      ...config.defaultProps,
    },
    expansionProps: {
      ...a.staticConfig.expansionProps,
      ...config.expansionProps,
    },
  }
}
