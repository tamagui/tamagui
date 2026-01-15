import React from 'react'
import { useMedia } from './hooks/useMedia'
import { useTheme } from './hooks/useTheme'

/** internal: this is for tamagui babel plugin usage only */

export const _withStableStyle = (
  Component: any,
  styleProvider: (theme: any, expressions: any[]) => Object
) =>
  React.forwardRef((props: any, ref) => {
    const { _expressions = [], ...rest } = props
    const theme = useTheme()

    // Only call useMedia if there are string media keys to resolve
    // This is safe because expressions are compile-time stable
    const hasMediaKeys = _expressions.some((expr: any) => typeof expr === 'string')
    const media = hasMediaKeys ? useMedia() : null

    const resolvedExpressions = media
      ? _expressions.map((expr: any) => (typeof expr === 'string' ? media[expr] : expr))
      : _expressions

    return (
      <Component ref={ref} style={styleProvider(theme, resolvedExpressions)} {...rest} />
    )
  })
