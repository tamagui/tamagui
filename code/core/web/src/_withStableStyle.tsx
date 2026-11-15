import React, { useContext } from 'react'
import { getConfigMaybe } from './config'
import { ComponentContext } from './contexts/ComponentContext'
import { getVariable } from './createVariable'
import type { NativeTextMetrics } from './helpers/nativeTextMetrics'
import { useMedia } from './hooks/useMedia'
import { useTheme } from './hooks/useTheme'
import { ThemeStateContext } from './hooks/useThemeState'

const isProd = process.env.NODE_ENV === 'production'

/** internal: this is for tamagui babel plugin usage only */

const EMPTY_EXPRESSIONS: any[] = []
const EMPTY_THEME = {}
const FALLBACK_THEME_CACHE = new WeakMap<object, Record<string, any>>()

export const _withStableStyle = (
  Component: any,
  createStyle: (theme: any, expressions: any[]) => object,
  hasThemeKeys?: boolean,
  hasMediaKeys?: boolean,
  // a flattened native text with its own font size and line height: element
  // children read them from the text context, as under the runtime Text
  textMetrics?: Required<Pick<NativeTextMetrics, 'fontSize' | 'lineHeight'>>
) =>
  React.memo(function WithStableStyle(props: any) {
    const { ref, ...propsWithoutRef } = props
    const { _expressions = EMPTY_EXPRESSIONS, ...rest } = propsWithoutRef

    const parentId = useContext(ThemeStateContext)

    // compile-time constants per wrapper, so conditional hooks are stable
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const theme = hasThemeKeys && parentId ? useTheme() : null
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const media = hasMediaKeys ? useMedia() : null
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const componentContext = textMetrics ? useContext(ComponentContext) : null

    const resolvedExpressions = media
      ? _expressions.map((expr: any) =>
          // ['gtLg', cond] needs the media query and the runtime condition
          Array.isArray(expr)
            ? !!(media[expr[0]] && expr[1])
            : typeof expr === 'string'
              ? media[expr]
              : expr
        )
      : _expressions

    let resolvedTheme: any = theme || EMPTY_THEME
    if (hasThemeKeys && !parentId) {
      // monorepo edge case: ThemeStateContext is from a different instance
      const config = getConfigMaybe()
      const themes = config?.themes
      if (themes) {
        for (const k in themes) {
          const fallbackTheme = themes.light || themes.dark || themes[k]
          let gettableTheme = FALLBACK_THEME_CACHE.get(fallbackTheme)
          if (!gettableTheme) {
            gettableTheme = {}
            for (const key in fallbackTheme) {
              const value = fallbackTheme[key]
              gettableTheme[key] =
                typeof (value as any)?.get === 'function'
                  ? value
                  : {
                      ...(value && typeof value === 'object' ? value : { val: value }),
                      get: () => getVariable(value),
                    }
            }
            FALLBACK_THEME_CACHE.set(fallbackTheme, gettableTheme)
          }
          resolvedTheme = gettableTheme
          break
        }
      }
      if (!isProd && process.env.NODE_ENV === 'development') {
        console.warn(
          '[@tamagui] _withStableStyle: no ThemeStateContext found. ' +
            'This usually means duplicate tamagui instances in a monorepo. ' +
            'Falling back to default theme from config.'
        )
      }
    }

    const content = (
      <Component
        ref={ref}
        style={createStyle(resolvedTheme, resolvedExpressions)}
        {...rest}
      />
    )
    const children = rest.children
    if (
      !componentContext ||
      children === null ||
      typeof children !== 'object' ||
      (componentContext.inText &&
        componentContext.parentFontSize === textMetrics!.fontSize &&
        componentContext.parentLineHeight === textMetrics!.lineHeight &&
        componentContext.animatedText === null)
    ) {
      return content
    }
    return (
      <ComponentContext.Provider
        {...componentContext}
        inText
        parentFontSize={textMetrics!.fontSize}
        parentLineHeight={textMetrics!.lineHeight}
        animatedText={null}
      >
        {content}
      </ComponentContext.Provider>
    )
  })
