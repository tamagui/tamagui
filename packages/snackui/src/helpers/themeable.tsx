import React, { ReactElement } from 'react'

import { Theme } from '../hooks/useTheme'
import { ThemeInverse } from '../views/ThemeInverse'

export type ThemeableProps = {
  theme?: string | null
  themeInverse?: boolean
}

export const themeable: ThemeableHOC = function graphql<
  R extends ReactElement<any, any> | null,
  P extends ThemeableProps = {}
>(component: (props: P) => R) {
  const withTheme: {
    (props: P): R
    displayName: string
  } = function WithTheme({ themeInverse, ...rest }) {
    const el = React.createElement(component, rest as any) as R
    if (themeInverse) {
      return (<ThemeInverse>{el}</ThemeInverse>) as R
    }
    if (rest.theme) {
      return (<Theme name={rest.theme || null}>{el}</Theme>) as R
    }
    return el
  }

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
