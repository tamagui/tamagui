import React, { useContext } from 'react'
import { getConfigMaybe } from './config'
import { useMedia } from './hooks/useMedia'
import { useTheme } from './hooks/useTheme'
import { ThemeStateContext } from './hooks/useThemeState'

/** internal: this is for tamagui babel plugin usage only */

const EMPTY_EXPRESSIONS: any[] = []
const EMPTY_THEME = {}

export const _withStableStyle = (
  Component: any,
  createStyle: (theme: any, expressions: any[]) => object,
  hasThemeKeys?: boolean,
  hasMediaKeys?: boolean
) =>
  React.memo(
    React.forwardRef((props: any, ref) => {
      const { _expressions = EMPTY_EXPRESSIONS, ...rest } = props

      const parentId = useContext(ThemeStateContext)

      // compile-time constants per wrapper, so conditional hooks are stable
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const theme = hasThemeKeys && parentId ? useTheme() : null
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const media = hasMediaKeys ? useMedia() : null

      const resolvedExpressions = media
        ? _expressions.map((expr: any) => (typeof expr === 'string' ? media[expr] : expr))
        : _expressions

      let resolvedTheme: any = theme || EMPTY_THEME
      if (hasThemeKeys && !parentId) {
        // monorepo edge case: ThemeStateContext is from a different instance
        const config = getConfigMaybe()
        const themes = config?.themes
        if (themes) {
          for (const k in themes) {
            resolvedTheme = themes.light || themes.dark || themes[k]
            break
          }
        }
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            '[@tamagui] _withStableStyle: no ThemeStateContext found. ' +
              'This usually means duplicate tamagui instances in a monorepo. ' +
              'Falling back to default theme from config.'
          )
        }
      }

      return (
        <Component
          ref={ref}
          style={createStyle(resolvedTheme, resolvedExpressions)}
          {...rest}
        />
      )
    })
  )
