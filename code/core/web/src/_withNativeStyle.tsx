import { setRef } from '@tamagui/compose-refs'
import { isAndroid, isIos } from '@tamagui/constants'
import React, { use } from 'react'
import { _withStableStyle } from './_withStableStyle'
import {
  createNativeStyleLinkState,
  getNativeStyleEngine,
  linkNativeStyleHost,
  resolveNativeStyleMapping,
  type NativeStyleLinkState,
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
 * One component over the host: the theme scope is the only context read and
 * the host ref queues the host for the engine's next batched link. Links never
 * detach (the engine prunes unmounted views), so a themed view costs one
 * component and one array push to mount.
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
  // one entry per scope. its style arrays (one per host mode) keep their
  // identity until the scope's state changes, then are rebuilt: a style handed
  // to a host is a prop, which react native freezes in development, so a theme
  // switch never writes into one. the entry's ref is stable, so a parent
  // re-render never detaches and re-attaches its hosts, and attaching records
  // the host against the state record every host of this scope shares
  const entries = new Map<string, ScopeEntry>()
  const createEntry = (): ScopeEntry => {
    const entry: ScopeEntry = {
      style: [baseStyle, null],
      hostTextStyle: [hostTextBase, null],
      stateName: '',
      theme: null,
      state: null!,
      ref: (node: unknown) => {
        if (node) linkHost(node, entry.state)
      },
    }
    return entry
  }
  // bundlers inline imports as a module lookup at every use; bind them once
  // here, outside the per-mount path
  const ScopeContext = ThemeStateContext
  const engineOf = getNativeStyleEngine
  const scopeState = getThemeState
  const resolve = resolveNativeStyleMapping
  const linkState = createNativeStyleLinkState
  const linkHost = linkNativeStyleHost
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
    let entry = entries.get(scopeId)
    if (!entry) {
      entry = createEntry()
      entries.set(scopeId, entry)
    }
    if (entry.stateName !== name || entry.theme !== theme) {
      const themed = resolve(themeStyleKeys, name, theme)
      entry.style = [baseStyle, themed]
      entry.hostTextStyle = [hostTextBase, themed]
      entry.stateName = name
      entry.theme = theme
      entry.state = linkState(themeStyleKeys, scopeId, name, theme)
    }
    const style = asHostText ? entry.hostTextStyle : entry.style
    const wrapped = resetsText || (asHostText && mayRenderText(rest.children))
    const state = entry.state
    // a user ref composes per render; without one the entry's stable ref links
    const hostRef =
      ref == null
        ? entry.ref
        : (node: unknown) => {
            if (!node) return assignRef(ref, null)
            linkHost(node, state)
            // a callback ref may return its own cleanup (React 19), which
            // then replaces its null call
            if (typeof ref === 'function') return ref(node)
            assignRef(ref, node)
          }
    const element = (
      <Rendered
        key={wrapped ? undefined : key}
        {...(asHostText && hostTextProps)}
        {...rest}
        ref={hostRef}
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

interface ScopeEntry {
  style: (object | null)[]
  hostTextStyle: (object | null)[]
  stateName: string
  theme: object | null
  state: NativeStyleLinkState
  ref: (node: unknown) => void
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
