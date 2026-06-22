import React, { useContext } from 'react'
import { getConfigMaybe, getSetting } from './config'
import { useMedia } from './hooks/useMedia'
import { useTheme } from './hooks/useTheme'
import { getThemeUntracked } from './hooks/getThemeProxied'
import { ThemeStateContext, ThemeStateValueContext } from './hooks/useThemeState'

/** internal: this is for tamagui babel plugin usage only */

const EMPTY_EXPRESSIONS: any[] = []
const EMPTY_THEME = {}

export const _withStableStyle = (
  Component: any,
  createStyle: (theme: any, expressions: any[]) => object,
  hasThemeKeys?: boolean,
  hasMediaKeys?: boolean
) => {
  let themeOptimizeInitial: boolean | undefined
  let lastTheme: any
  let lastStyle: object | undefined

  return React.memo(
    React.forwardRef((props: any, ref) => {
      const { _expressions = EMPTY_EXPRESSIONS, ...rest } = props

      const parentId = useContext(ThemeStateContext)
      const shouldOptimizeTheme =
        hasThemeKeys &&
        (themeOptimizeInitial ??= getSetting('themeOptimize') === 'initial-render')
      const parentThemeState = shouldOptimizeTheme
        ? // eslint-disable-next-line react-hooks/rules-of-hooks
          useContext(ThemeStateValueContext)
        : null

      // compile-time constants per wrapper, so conditional hooks are stable
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const theme =
        hasThemeKeys && parentId
          ? shouldOptimizeTheme
            ? getThemeUntracked(parentThemeState)
            : // eslint-disable-next-line react-hooks/rules-of-hooks
              useTheme()
          : null
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

      const style =
        shouldOptimizeTheme && !hasMediaKeys && resolvedExpressions === EMPTY_EXPRESSIONS
          ? lastTheme === resolvedTheme
            ? lastStyle!
            : ((lastTheme = resolvedTheme),
              (lastStyle = createStyle(resolvedTheme, resolvedExpressions)))
          : createStyle(resolvedTheme, resolvedExpressions)

      return <Component ref={ref} style={style} {...rest} />
    })
  )
}
