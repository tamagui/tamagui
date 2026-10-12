import { setRef } from '@tamagui/compose-refs'
import { isAndroid, isIos } from '@tamagui/constants'
import React, { use } from 'react'
import { _withStableStyle } from './_withStableStyle'
import {
  getNativeStyleEngine,
  linkNativeStyleMapping,
  resolveNativeStyleMapping,
  type NativeStyleThemeMapping,
} from './helpers/nativeStyleEngine'
import { getThemeState, ThemeStateContext } from './hooks/useThemeState'
import { hooks } from './setupHooks'

// the host props RN's <Text> passes for a non-pressable text outside a text
// ancestor, given none of the props it remaps (the compiler guarantees that)
const hostTextProps = {
  accessible: isAndroid ? false : isIos ? true : undefined,
  allowFontScaling: true,
  ellipsizeMode: 'tail',
}

/**
 * internal: emitted by the native compiler when experimental.nativeFastPath is on.
 *
 * One component over the host: the theme scope is the only context read, the
 * host ref links straight to the engine and unlinks through React's ref
 * cleanup, so a themed view costs one component and one engine call to mount.
 *
 * `host: 'view'`: `Component` is RN's host view (`unstable_NativeView`).
 * <View> resets TextAncestorContext for its children when it sits inside a
 * <Text>; this wrapper does that reset itself, so the host view can carry
 * children without changing what a nested <Text> renders.
 *
 * `host: 'text'`: `Component` is RN's <Text>, and outside a text ancestor this
 * renders its host (`unstable_NativeText`) with the exact props <Text> would
 * pass: the defaults above, `overflow: 'hidden'` first in the style, a string
 * fontWeight, and TextAncestorContext only around element children. Inside a
 * text ancestor it renders <Text>, which owns the virtual text path.
 */
export const _withNativeStyle = (
  Component: any,
  baseStyle: Record<string, unknown>,
  themeStyleKeys: NativeStyleThemeMapping,
  host?: 'view' | 'text'
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
  const baseViews = host ? hooks.getBaseViews?.() : undefined
  const TextAncestor: React.Context<boolean> | undefined = baseViews?.TextAncestor
  const TextAncestorProvider = TextAncestor?.Provider as React.Provider<boolean>
  // <Text> rewrites userSelect and verticalAlign into other props
  const HostText =
    host === 'text' && !('userSelect' in baseStyle) && !('verticalAlign' in baseStyle)
      ? baseViews?.NativeText
      : undefined
  const hostTextBase = HostText
    ? {
        overflow: 'hidden',
        ...baseStyle,
        ...(typeof baseStyle.fontWeight === 'number' && {
          fontWeight: String(baseStyle.fontWeight),
        }),
      }
    : baseStyle
  // one style array per scope and host mode, its theme slot set to the scope's
  // current state on every render. the engine owns a linked view's theme
  // values, so a re-render after a switch hands React the same array, its diff
  // skips the style, and the host is not re-committed with values the engine
  // already applied. a new host reads the array's current state at creation
  const styles = new Map<string, (object | null)[]>()
  const hostTextStyles = new Map<string, (object | null)[]>()
  // bundlers inline imports as a module lookup at every use; bind them once
  // here, outside the per-mount path
  const ScopeContext = ThemeStateContext
  const engineOf = getNativeStyleEngine
  const scopeState = getThemeState
  const resolve = resolveNativeStyleMapping
  const linkMapping = linkNativeStyleMapping
  const assignRef = setRef

  // `use` reads context from whichever render calls it, so the compiler can
  // call this straight from the parent component's render (see `inline`)
  const render = (props: any, key?: React.Key | null) => {
    const scopeId = use(ScopeContext)
    const inText = TextAncestor ? use(TextAncestor) : false
    const themeState = scopeId && engineOf() ? scopeState(scopeId) : undefined
    const resetsText = inText && host === 'view'

    if (!themeState) {
      return resetsText ? (
        <TextAncestorProvider key={key} value={false}>
          <Fallback {...props} />
        </TextAncestorProvider>
      ) : (
        <Fallback key={key} {...props} />
      )
    }

    // compiled createElement calls carry an `_expressions` prop for the
    // fallback; jsx never does, so it forwards its props without a copy
    let rest = props
    if (props._expressions !== undefined) {
      const { _expressions: _ignoredExpressions, ...withoutExpressions } = props
      rest = withoutExpressions
    }
    const ref = props.ref
    const { name, theme } = themeState
    const asHostText = HostText && !inText
    const Rendered = asHostText ? HostText : Component
    const cache = asHostText ? hostTextStyles : styles
    let style = cache.get(scopeId)
    if (!style) {
      style = [asHostText ? hostTextBase : baseStyle, null]
      cache.set(scopeId, style)
    }
    style[1] = resolve(themeStyleKeys, name, theme)
    const wrapped = resetsText || (asHostText && mayRenderText(rest.children))
    const element = (
      <Rendered
        key={wrapped ? undefined : key}
        {...(asHostText && hostTextProps)}
        {...rest}
        ref={(node: unknown) => {
          // a callback ref may return its own cleanup (React 19), which then
          // replaces the null call
          let refCleanup: unknown
          if (typeof ref === 'function') refCleanup = ref(node)
          else assignRef(ref, node)
          const link = linkMapping(node, themeStyleKeys, scopeId, name, theme)
          return () => {
            link?.unlink()
            if (typeof refCleanup === 'function') refCleanup()
            else assignRef(ref, null)
          }
        }}
        style={style}
      />
    )

    if (!wrapped) return element
    return (
      <TextAncestorProvider key={key} value={!resetsText}>
        {element}
      </TextAncestorProvider>
    )
  }

  const NativeStyleView = (props: any) => render(props)
  // the compiler emits `View.inline(<View ... />)` where the calling
  // component's theme scope is provably the element's own: the element is
  // only built, never mounted, and its host renders in the caller's place
  NativeStyleView.inline = (element: React.ReactElement<any>) =>
    render(element.props, element.key)
  return NativeStyleView
}

// <Text>'s own check for children that could render a nested <Text>: arrays
// longer than three are assumed to
function mayRenderText(children: unknown): boolean {
  if (children == null) return false
  if (Array.isArray(children) && children.length <= 3) {
    return children.some((child) => child != null && typeof child === 'object')
  }
  return typeof children === 'object'
}
