import { StaticConfig } from './StaticConfig'

export type StaticComponent<A = any> = ((props: A) => JSX.Element) & {
  staticConfig: StaticConfig
}

export function extendStaticConfig(a: any, config: StaticConfig = {}) {
  if (process.env.TARGET === 'client') {
    return
  }
  if (!a.staticConfig) {
    throw new Error(`No static config: ${a} ${JSON.stringify(config)}`)
  }
  return {
    isText: config.isText ?? a.staticConfig.isText,
    neverFlatten: config.neverFlatten ?? a.staticConfig.neverFlatten,
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
