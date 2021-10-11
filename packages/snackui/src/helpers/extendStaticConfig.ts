import React from 'react'

import { PropMapper } from './PropMapper'
import { StaticConfig } from './StaticConfig'

export type StaticComponent<A = any> = React.FunctionComponent<A> & {
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
    preProcessProps: !a.staticConfig.preProcessProps
      ? config.preProcessProps
      : (props) => {
          return {
            ...a.staticConfig.preProcessProps(props),
            ...config.preProcessProps?.(props),
          }
        },
    propMapper: config.propMapper ?? a.staticConfig.propMapper,
    postProcessStyles: !a.staticConfig.postProcessStyles
      ? config.postProcessStyles
      : config.postProcessStyles
      ? (styles) => config.postProcessStyles!(a.staticConfig.postProcessStyles(styles))
      : undefined,
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
