import { setRef } from '@tamagui/compose-refs'
import React, { useCallback, useContext, useRef } from 'react'
import { _withStableStyle } from './_withStableStyle'
import {
  getNativeStyleEngine,
  linkNativeStyleMapping,
  resolveNativeStyleMapping,
  type NativeStyleEngineLinkHandle,
  type NativeStyleThemeMapping,
} from './helpers/nativeStyleEngine'
import { getThemeState, ThemeStateContext } from './hooks/useThemeState'

/** internal: emitted by the native compiler when experimental.nativeFastPath is on */
export const _withNativeStyle = (
  Component: any,
  baseStyle: Record<string, unknown>,
  themeStyleKeys: NativeStyleThemeMapping
) => {
  const Fallback = _withStableStyle(
    Component,
    (theme) => {
      const themedStyle: Record<string, unknown> = {}
      for (const styleKey in themeStyleKeys) {
        themedStyle[styleKey] = theme[themeStyleKeys[styleKey]]?.get()
      }
      return [baseStyle, themedStyle]
    },
    true,
    false
  )

  const Native = React.memo(function NativeStyleView({
    _scopeId,
    ...props
  }: {
    _scopeId: string
    [key: string]: any
  }) {
    const { ref, _expressions: _ignoredExpressions, ...rest } = props
    const link = useRef<NativeStyleEngineLinkHandle | null>(null)
    const themeState = getThemeState(_scopeId)
    const stateName = themeState?.name
    const theme = themeState?.theme
    const hostRef = useCallback(
      (host: unknown) => {
        link.current?.unlink()
        link.current = null
        setRef(ref, host)
        if (host && stateName && theme) {
          link.current = linkNativeStyleMapping(
            host,
            baseStyle,
            themeStyleKeys,
            _scopeId,
            stateName,
            theme
          )
        }
      },
      [ref, _scopeId, stateName, theme]
    )
    const stateStyle =
      stateName && theme
        ? resolveNativeStyleMapping(themeStyleKeys, stateName, theme)
        : undefined

    if (process.env.NODE_ENV === 'development' && (!stateName || !theme)) {
      throw new Error(
        `[@tamagui/core] native fast path cannot resolve theme ${JSON.stringify(stateName)}`
      )
    }

    return <Component ref={hostRef} style={[baseStyle, stateStyle]} {...rest} />
  })

  return React.memo(function NativeStyleBoundary(props: any) {
    const scopeId = useContext(ThemeStateContext)
    return getNativeStyleEngine() && scopeId ? (
      <Native {...props} _scopeId={scopeId} />
    ) : (
      <Fallback {...props} />
    )
  })
}
