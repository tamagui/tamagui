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
    postProcessStyles: (styles) => {
      a.staticConfig.postProcessStyles(styles)
      config.postProcessStyles?.(styles)
    },
    validStyles: {
      ...a.staticConfig.validStyles,
      ...config.validStyles,
    },
    validPropsExtra: {
      ...a.staticConfig.validPropsExtra,
      ...config.validPropsExtra,
    },
    defaultProps: {
      ...a.staticConfig.defaultProps,
      ...config.defaultProps,
    },
  }
}
