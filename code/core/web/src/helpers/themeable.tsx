import React from 'react'

import type { StaticConfig, ThemeableProps, ThemeProps } from '../types'
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

    // we filter out the props here, why?
    // Theme internally avoids wrapping <span /> unless 'theme' in props
    // reason for this is to avoid wrapping every single component with span
    // *if* ever it themes once, it leaves the span, to avoid reparenting
    // its expected if users want to avoid re-parenting, they keep the theme prop
    // and just set it to null. but we need to "respect" that here by filtering
    // one example of a bug caused by not doing this is in <Select native> on web
    // where it renders to an <option />, and then Theme would wrap a <span /> in that
    // which is not allowed in HTML and causes hydration errors / logs
    const filteredProps: Partial<ThemeProps> = {
      componentName: componentName || staticConfig?.componentName,
    }
    if ('debug' in props) {
      filteredProps.debug = props.debug
    }
    if ('theme' in props) {
      filteredProps.name = props.theme
    }
    if ('themeInverse' in props) {
      filteredProps.inverse = props.themeInverse
    }
    if ('themeReset' in props) {
      filteredProps.reset = themeReset
    }

    let contents = (
      <Theme disable-child-theme {...filteredProps}>
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
