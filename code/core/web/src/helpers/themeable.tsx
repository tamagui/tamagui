import React from 'react'

import type { StaticConfig, ThemeableProps } from '../types'
import { Theme } from '../views/Theme'

export function themeable<ComponentType extends (props: any) => any>(
  Component: ComponentType,
  staticConfig?: Partial<StaticConfig>
) {
  const withThemeComponent = React.forwardRef(function WithTheme(
    props: ThemeableProps,
    ref
  ) {
    const { themeInverse, theme, componentName, themeReset, ...rest } = props

    let overriddenContextProps: Object | undefined
    const context = staticConfig?.context
    if (context) {
      for (const key in context.props) {
        const val = props[key]
        if (val !== undefined) {
          overriddenContextProps ||= {}
          overriddenContextProps[key] = val
        }
      }
    }

    const element = (
      // @ts-expect-error its ok
      <Component ref={ref} {...rest} data-disable-theme />
    )

    let contents = (
      <Theme
        componentName={componentName || staticConfig?.componentName}
        name={theme}
        disable-child-theme
        debug={props.debug}
        inverse={themeInverse}
        reset={themeReset}
      >
        {element}
      </Theme>
    )

    if (context) {
      const Provider = context.Provider
      const contextValue = React.useContext(context)
      contents = (
        <Provider {...contextValue} {...overriddenContextProps}>
          {contents}
        </Provider>
      )
    }

    return contents
  })

  const withTheme: any = withThemeComponent
  withTheme.displayName = `Themed(${
    (Component as any)?.displayName || (Component as any)?.name || 'Anonymous'
  })`

  return withTheme as ComponentType extends (props: infer P) => infer R
    ? (props: Omit<P, 'theme' | 'themeInverse'> & ThemeableProps) => R
    : unknown
}
