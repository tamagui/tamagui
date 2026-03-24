import React, { useContext } from 'react'
import { getConfigMaybe } from './config'
import { useMedia } from './hooks/useMedia'
import { useTheme } from './hooks/useTheme'
import { ThemeStateContext } from './hooks/useThemeState'

/** internal: this is for tamagui babel plugin usage only */

export const _withStableStyle = (
  Component: any,
  createStyle: (theme: any, expressions: any[]) => object
) =>
  React.memo(
    React.forwardRef((props: any, ref) => {
      const { _expressions = [], ...rest } = props

      // in monorepo setups (pnpm, etc.) module duplication can cause the
      // ThemeStateContext here to be a different instance than the one in
      // TamaguiProvider, making the provider invisible. fall back to config
      // themes instead of crashing with "Missing theme".
      const parentId = useContext(ThemeStateContext)
      if (!parentId) {
        const config = getConfigMaybe()
        const themes = config?.themes
        const fallback = themes
          ? themes.light || themes.dark || Object.values(themes)[0]
          : {}
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            '[@tamagui] _withStableStyle: no ThemeStateContext found. ' +
              'This usually means duplicate tamagui instances in a monorepo. ' +
              'Falling back to default theme from config.'
          )
        }
        return (
          <Component ref={ref} style={createStyle(fallback, _expressions)} {...rest} />
        )
      }

      const theme = useTheme()

      // Only call useMedia if there are string media keys to resolve
      // This is safe because expressions are compile-time stable
      const hasMediaKeys = _expressions.some((expr: any) => typeof expr === 'string')
      const media = hasMediaKeys ? useMedia() : null

      const resolvedExpressions = media
        ? _expressions.map((expr: any) => (typeof expr === 'string' ? media[expr] : expr))
        : _expressions

      return (
        <Component ref={ref} style={createStyle(theme, resolvedExpressions)} {...rest} />
      )
    })
  )
