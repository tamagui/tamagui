import React, { ReactElement, forwardRef } from 'react'

import { ThemeName } from '../types'
import { Theme } from '../views/Theme'
import { ThemeInverse } from '../views/ThemeInverse'

export type ThemeableProps = {
  theme?: ThemeName | string | null
  themeInverse?: boolean
}

export const themeable: ThemeableHOC = function graphql<
  R extends ReactElement<any, any> | null,
  P extends ThemeableProps = {}
>(component: (props: P) => R) {
  const withThemeComponent = forwardRef(function WithTheme(
    { themeInverse, theme, ...rest }: P,
    ref
  ) {
    const element = React.createElement(component, { ...rest, ref } as any) as R
    if (themeInverse) {
      return (<ThemeInverse>{element}</ThemeInverse>) as R
    }
    if (theme) {
      return (<Theme name={(theme as any) || null}>{element}</Theme>) as R
    }
    return element
  })

  const withTheme: {
    (props: P): R
    displayName: string
  } = withThemeComponent as any

  withTheme.displayName = `Themed(${
    (component as any)?.displayName || (component as any)?.name || 'Anonymous'
  })`

  return withTheme
}

export interface ThemeableHOC {
  <R extends ReactElement<any, any> | null, P extends ThemeableProps = {}>(
    component: (props: P) => R
  ): (props: P) => R
}
