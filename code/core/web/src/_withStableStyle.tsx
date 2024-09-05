import React from 'react'
import { useTheme } from './hooks/useTheme'

/** internal: this is for tamagui babel plugin usage only */

export const _withStableStyle = (
  Component: any,
  styleProvider: (theme: any, expressions: any[]) => Object
) =>
  React.forwardRef((props: any, ref) => {
    const { _expressions = [], ...rest } = props
    const theme = useTheme()
    return <Component ref={ref} style={styleProvider(theme, _expressions)} {...rest} />
  })
