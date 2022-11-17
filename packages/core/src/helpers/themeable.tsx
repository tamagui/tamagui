import React, { forwardRef } from 'react'

import { ThemeName } from '../types'
import { Theme } from '../views/Theme'
import { ThemeInverse } from '../views/ThemeInverse'

export interface ThemeableProps {
  theme?: ThemeName | null
  themeInverse?: boolean
}

export function themeable<Component extends (props: any) => any>(
  component: Component,
  opts?: { componentName?: string }
) {
  const withThemeComponent = forwardRef(function WithTheme(props: any, ref) {
    const { themeInverse, theme, ...rest } = props
    const element = React.createElement(component, { ...rest, ref } as any)
    
    return (
      <ThemeInverse disabled={!themeInverse}>
        <Theme componentName={opts?.componentName} name={(theme as any) || null}>
          {element}
        </Theme>
      </ThemeInverse>
    )
  })

  const withTheme: any = withThemeComponent
  withTheme.displayName = `Themed(${
    (component as any)?.displayName || (component as any)?.name || 'Anonymous'
  })`

  return withTheme as Component extends (props: infer P) => infer R
    ? (props: Omit<P, 'theme' | 'themeInverse'> & ThemeableProps) => R
    : unknown
}
