import { StaticConfig } from './StaticConfig'

export type StaticComponent<A = any> = ((props: A) => JSX.Element) & {
  staticConfig: StaticConfig
}

export function extendStaticConfig(
  a: { staticConfig?: StaticConfig } | any,
  config: StaticConfig = {}
): StaticConfig | null {
  if (process.env.TARGET === 'client') {
    return null
  }
  if (!a.staticConfig) {
    throw new Error(`No static config: ${a} ${JSON.stringify(config)}`)
  }
  return {
    isText: config.isText || a.staticConfig.isText || false,
    neverFlatten: config.neverFlatten ?? a.staticConfig.neverFlatten,
    postProcessStyles: config.postProcessStyles ?? a.staticConfig.postProcessStyles,
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
