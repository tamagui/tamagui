import React, { ReactElement } from 'react'

import { Theme } from '../hooks/useTheme'

export const themeable: ThemeableHOC = function graphql<
  R extends ReactElement<any, any> | null,
  P extends { theme?: any } = {}
>(Component: (props: P) => R) {
  const withTheme: {
    (props: P): R
    displayName: string
  } = function WithTheme(props) {
    const el = React.createElement(Component, props) as R
    if (props.theme) {
      return (<Theme name={props.theme}>{el}</Theme>) as R
    }
    return el
  }

  withTheme.displayName = `Themed(${
    (Component as any)?.displayName || (Component as any)?.name || 'Anonymous'
  })`

  return withTheme
}

export interface ThemeableHOC {
  <R extends ReactElement<any, any> | null, P extends { theme?: any } = {}>(
    component: (props: P) => R
  ): (props: P) => R
}
