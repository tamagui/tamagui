import { jsx } from 'react/jsx-runtime'
import {
  Image,
  Pressable,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native'
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
  type Ref,
} from 'react'
import { unitlessNumberProperties } from '@tamagui/style-grammar/runtime'

import {
  clickFromPress,
  errorFromImage,
  keyFromKeyPress,
  loadFromImage,
  textEntryChange,
} from './adapters'
import { domEventProps } from './domEventProps.native'
import type {
  DOMImageProps,
  DOMTextInputProps,
  DOMTextProps,
  DOMViewProps,
} from './contract'
import { createComponent } from '../createComponent'
import { textStaticConfig } from '../views/Text'
import { viewStaticConfig } from '../views/View'

type DOMMetadata = {
  __inherit?: boolean
  __inheritedStyles?: Record<string, unknown>
  __tag?: string
  __styles?: ReadonlyArray<Record<string, unknown> | false | null | undefined>
  ref?: Ref<unknown>
  children?: unknown
}

const refCallbacks = new WeakMap<
  object,
  Map<string, (instance: object | null) => void | (() => void)>
>()
const refFacades = new WeakMap<object, Map<string, object>>()
const viewportScaleContext = createContext({ scale: 1 })
type InheritedTextStyle = {
  style: Record<string, unknown>
  lineHeightMultiplier?: number
}
const emptyInheritedTextStyle: InheritedTextStyle = { style: {} }
const inheritedTextStyleContext = createContext<InheritedTextStyle>(
  emptyInheritedTextStyle
)
const inheritableTextProperties = new Set([
  'color',
  'cursor',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
  'textAlign',
  'textDecorationColor',
  'textDecorationLine',
  'textDecorationStyle',
  'textIndent',
  'textShadowColor',
  'textShadowOffset',
  'textShadowRadius',
  'textTransform',
  'whiteSpace',
  'writingDirection',
])
const runtimeInheritedPassthroughProperties = new Set(['textIndent', 'whiteSpace'])
const lengthProperties = [
  'clientHeight',
  'clientLeft',
  'clientTop',
  'clientWidth',
  'offsetHeight',
  'offsetLeft',
  'offsetTop',
  'offsetWidth',
  'scrollHeight',
  'scrollLeft',
  'scrollTop',
  'scrollWidth',
] as const

export function DOMViewportProvider({
  children,
  viewportWidth,
}: {
  children?: ReactNode
  viewportWidth: number
}) {
  const { width } = useWindowDimensions()
  const scale = viewportWidth > 0 ? width / viewportWidth : 1
  const value = useMemo(() => ({ scale }), [scale])
  return jsx(viewportScaleContext.Provider, { value, children })
}

export function useViewportScale_DO_NOT_USE() {
  return useContext(viewportScaleContext)
}

function assignRef(ref: Ref<unknown>, value: unknown) {
  if (typeof ref === 'function') return ref(value)
  else if (ref) (ref as { current: unknown }).current = value
}

function scaledRect(rect: Record<string, any>, scale: number) {
  const value = (name: string) =>
    typeof rect[name] === 'number' ? rect[name] / scale : rect[name]
  const DOMRectConstructor = globalThis.DOMRect
  if (DOMRectConstructor) {
    return new DOMRectConstructor(value('x'), value('y'), value('width'), value('height'))
  }
  return {
    ...rect,
    x: value('x'),
    y: value('y'),
    width: value('width'),
    height: value('height'),
    top: value('top'),
    right: value('right'),
    bottom: value('bottom'),
    left: value('left'),
  }
}

function facadeFor(instance: object, tag: string, viewportScale: number) {
  let byTag = refFacades.get(instance)
  if (!byTag) {
    byTag = new Map()
    refFacades.set(instance, byTag)
  }
  const cacheKey = `${tag}:${viewportScale}`
  const existing = byTag.get(cacheKey)
  if (existing) return existing
  const facade = Object.create(instance)
  for (const name of [
    'blur',
    'focus',
    'measure',
    'measureInWindow',
    'measureLayout',
    'setNativeProps',
    'getRootNode',
  ]) {
    const method = (instance as Record<string, unknown>)[name]
    if (typeof method === 'function') {
      Object.defineProperty(facade, name, {
        configurable: true,
        value: method.bind(instance),
      })
    }
  }
  Object.defineProperties(facade, {
    nodeName: { enumerable: true, value: tag.toUpperCase() },
    tagName: { enumerable: true, value: tag.toUpperCase() },
  })
  const host = instance as Record<string, any>
  if (typeof host.getBoundingClientRect === 'function') {
    Object.defineProperty(facade, 'getBoundingClientRect', {
      configurable: true,
      value:
        viewportScale === 1
          ? host.getBoundingClientRect.bind(instance)
          : () => scaledRect(host.getBoundingClientRect.call(instance), viewportScale),
    })
  }
  if (viewportScale !== 1) {
    for (const property of lengthProperties) {
      if (property in host) {
        Object.defineProperty(facade, property, {
          configurable: true,
          get: () =>
            typeof host[property] === 'number'
              ? host[property] / viewportScale
              : host[property],
        })
      }
    }
  }
  if (tag === 'img') {
    Object.defineProperty(facade, 'complete', {
      configurable: true,
      enumerable: true,
      get: () => host.complete ?? false,
    })
  }
  if (tag === 'input' || tag === 'textarea') {
    let selectionStart = 0
    let selectionEnd = 0
    Object.defineProperties(facade, {
      selectionStart: {
        enumerable: true,
        get: () => selectionStart,
      },
      selectionEnd: {
        enumerable: true,
        get: () => selectionEnd,
      },
      ...(typeof host.setSelectionRange !== 'function'
        ? {
            setSelectionRange: {
              configurable: true,
              enumerable: true,
              value(start: number, end = start) {
                selectionStart = start
                selectionEnd = end
                if (typeof host.setSelection === 'function') {
                  host.setSelection.call(instance, start, end)
                } else {
                  host.setNativeProps?.({ selection: { start, end } })
                }
              },
            },
          }
        : {}),
    })
  }
  byTag.set(cacheKey, facade)
  return facade
}

/** @internal Executable ref-contract seam; not exported from the package entry. */
export function createDOMRefCallback(
  ref: Ref<unknown>,
  tag: string,
  viewportScale: number
) {
  const identity = ref as object
  let byTag = refCallbacks.get(identity)
  if (!byTag) {
    byTag = new Map()
    refCallbacks.set(identity, byTag)
  }
  const cacheKey = `${tag}:${viewportScale}`
  let callback = byTag.get(cacheKey)
  if (!callback) {
    let release: (() => void) | undefined
    callback = (instance) => {
      if (!instance) {
        if (release) return release()
        return assignRef(ref, null)
      }
      release?.()
      const cleanup = assignRef(ref, facadeFor(instance, tag, viewportScale))
      const currentRelease = () => {
        if (release !== currentRelease) return
        release = undefined
        if (typeof cleanup === 'function') cleanup()
        else assignRef(ref, null)
      }
      release = currentRelease
      return currentRelease
    }
    byTag.set(cacheKey, callback)
  }
  return callback
}

function resolveDOMMetadata<T extends DOMMetadata>(props: T, viewportScale = 1): T {
  const { __inherit: _, __tag, ref, ...rest } = props
  if (!__tag && !props.__inherit) return props
  const next = rest as T
  if (__tag === 'br' && next.children === undefined) next.children = '\n'
  if (ref) {
    next.ref = __tag ? createDOMRefCallback(ref, __tag, viewportScale) : ref
  }
  return next
}

function hasInheritableStyle(style: unknown) {
  if (Array.isArray(style)) return style.some(hasInheritableStyle)
  if (!style || typeof style !== 'object') return false
  for (const property of inheritableTextProperties) {
    if (property in style) return true
  }
  return false
}

function resolveInheritedTextStyle(
  style: unknown,
  parent: InheritedTextStyle
): InheritedTextStyle {
  const values = (Array.isArray(style) ? style.flat(Infinity) : [style]).filter(
    Boolean
  ) as Record<string, unknown>[]
  const inherited = { ...parent.style }
  let lineHeightMultiplier = parent.lineHeightMultiplier
  for (const value of values) {
    for (const property of inheritableTextProperties) {
      if (!(property in value)) continue
      const next = value[property]
      if (next === 'inherit' || next === 'unset') {
        if (!(property in parent.style)) inherited[property] = undefined
        continue
      }
      if (property === 'lineHeight' && typeof next === 'number') {
        lineHeightMultiplier = next
      } else {
        inherited[property] =
          typeof next === 'string' && /^-?(?:\d+\.?\d*|\.\d+)px$/.test(next)
            ? Number(next.slice(0, -2))
            : next
        if (property === 'lineHeight') lineHeightMultiplier = undefined
      }
    }
  }
  if (lineHeightMultiplier !== undefined) {
    inherited.lineHeight =
      typeof inherited.fontSize === 'number'
        ? lineHeightMultiplier * inherited.fontSize
        : lineHeightMultiplier
  }
  return { style: inherited, lineHeightMultiplier }
}

function DOMViewWithInheritedStyle({
  props,
  style,
}: {
  props: DOMViewProps
  style: unknown
}) {
  const parent = useContext(inheritedTextStyleContext)
  const value = resolveInheritedTextStyle(style, parent)
  return jsx(inheritedTextStyleContext.Provider, {
    value,
    children: renderDOMView(props),
  })
}

function resolvedDOMView(props: DOMViewProps) {
  if (
    !hasInheritableStyle(props.style) &&
    !hasInheritableStyle(props.__inheritedStyles)
  ) {
    return renderDOMView(props)
  }
  return jsx(DOMViewWithInheritedStyle, {
    props,
    style: [props.style, props.__inheritedStyles],
  })
}

function DOMTextWithInheritedStyle({ props }: { props: DOMTextProps }) {
  const parent = useContext(inheritedTextStyleContext)
  const value = resolveInheritedTextStyle([props.style, props.__inheritedStyles], parent)
  const resolved = {
    ...props,
    style: [props.style, value.style],
  } as DOMTextProps
  return jsx(inheritedTextStyleContext.Provider, {
    value,
    children: renderDOMText(resolved),
  })
}

function resolvedDOMText(props: DOMTextProps) {
  return props.__inherit
    ? jsx(DOMTextWithInheritedStyle, { props: resolveDOMMetadata(props) })
    : renderDOMText(resolveDOMMetadata(props))
}

function DOMTextInputWithInheritedStyle({ props }: { props: DOMTextInputProps }) {
  const parent = useContext(inheritedTextStyleContext)
  const inherited = resolveInheritedTextStyle(
    [props.style, props.__inheritedStyles],
    parent
  )
  const resolved = {
    ...props,
    style: [props.style, inherited.style],
  } as DOMTextInputProps
  return renderDOMTextInput(resolved)
}

function resolvedDOMTextInput(props: DOMTextInputProps) {
  return props.__inherit
    ? jsx(DOMTextInputWithInheritedStyle, { props: resolveDOMMetadata(props) })
    : renderDOMTextInput(resolveDOMMetadata(props))
}

function withViewportRef<T extends DOMMetadata>(
  render: (props: T) => ReturnType<typeof jsx>,
  props: T
) {
  const { scale } = useViewportScale_DO_NOT_USE()
  return render(resolveDOMMetadata(props, scale))
}

function mergeRuntimeStyles(
  styles: DOMMetadata['__styles']
): Record<string, unknown> | null {
  if (!styles) return null
  let merged: Record<string, unknown> | null = null
  for (const style of styles) {
    if (!style) continue
    merged ||= {}
    for (const property in style) {
      const value = style[property]
      if (unitlessNumberProperties.has(property)) {
        merged[property] = value
      } else if (typeof value === 'number' && Number.isFinite(value)) {
        merged[property] = `${value}px`
      } else if (typeof value === 'string') {
        merged[property] = value.replace(
          /(^|\s)((?:@?[A-Za-z][A-Za-z0-9-]*(?:\/[A-Za-z0-9_-]+)?:)*)(-?(?:\d+\.?\d*|\.\d+))(?=\s|$)/g,
          '$1$2$3px'
        )
      } else {
        merged[property] = value
      }
    }
  }
  return merged
}

/**
 * The native DOM primitives the compiler injects, one per native backing in
 * `NATIVE_BACKING`.
 *
 * Read `contract.ts` first: by the time one of these renders, the compiler has
 * already resolved the tag, the styles, the display emulation and every prop
 * name. What is left is adapting an event payload, which cannot happen before
 * the event exists.
 *
 * Three properties hold for every primitive here, and the tests assert all
 * three because they are the difference between this and a per-element cost
 * that shows up in a list of a thousand rows:
 *
 * 1. No hooks on the ref-free common path. The tests call that path as plain
 *    functions. A compiler-tagged ref renders a small component that reads the
 *    viewport scale required by the DOM geometry contract.
 * 2. Static elements do no display or text-ancestor context work. The compiler
 *    resolves display emulation ahead of time. Only compiler-marked text and
 *    dynamic style() programs enter the inherited-style/runtime context paths.
 * 3. Nothing is allocated for a prop that was not passed. An element with no
 *    handlers forwards the props object it was given, with no copy.
 */

export function DOMView(props: DOMViewProps) {
  if (props.__tag && props.ref) return jsx(DOMViewWithViewportRef, props)
  return resolvedDOMView(resolveDOMMetadata(props))
}

function DOMViewWithViewportRef(props: DOMViewProps) {
  return withViewportRef(resolvedDOMView, props)
}

function renderDOMView(resolved: DOMViewProps) {
  if (resolved.onClick === undefined && !('__inheritedStyles' in resolved)) {
    return jsx(View, resolved)
  }
  const { __inheritedStyles: _, onClick, ...hostProps } = resolved
  if (onClick === undefined)
    return jsx(View, hostProps)
    // react native's View has no press handling, so a clickable one is a Pressable
  ;(hostProps as Record<string, unknown>).onPress = clickFromPress(onClick)
  return jsx(Pressable, hostProps)
}

export function DOMText(props: DOMTextProps) {
  if (props.__tag && props.ref) return jsx(DOMTextWithViewportRef, props)
  return resolvedDOMText(props)
}

function DOMTextWithViewportRef(props: DOMTextProps) {
  return withViewportRef(resolvedDOMText, props)
}

function renderDOMText(resolved: DOMTextProps) {
  if (resolved.onClick === undefined && !('__inheritedStyles' in resolved)) {
    return jsx(Text, resolved)
  }
  const { __inheritedStyles: _, onClick, ...hostProps } = resolved
  if (onClick === undefined)
    return jsx(Text, hostProps)
    // react native's Text presses on its own, so this stays one element
  ;(hostProps as Record<string, unknown>).onPress = clickFromPress(onClick)
  return jsx(Text, hostProps)
}

export function DOMImage(props: DOMImageProps) {
  if (props.__tag && props.ref) return jsx(DOMImageWithViewportRef, props)
  return renderDOMImage(resolveDOMMetadata(props))
}

function DOMImageWithViewportRef(props: DOMImageProps) {
  return withViewportRef(renderDOMImage, props)
}

function renderDOMImage(resolved: DOMImageProps) {
  if (
    resolved.onClick === undefined &&
    resolved.onLoad === undefined &&
    resolved.onError === undefined &&
    !('__inheritedStyles' in resolved)
  ) {
    return jsx(Image, resolved)
  }
  const { __inheritedStyles: _, onClick, onLoad, onError, ...hostProps } = resolved
  if (onClick === undefined && onLoad === undefined && onError === undefined) {
    return jsx(Image, hostProps)
  }
  const next = hostProps as Record<string, unknown>
  if (onClick) next.onPress = clickFromPress(onClick)
  if (onLoad) next.onLoad = loadFromImage(onLoad)
  if (onError) next.onError = errorFromImage(onError)
  return jsx(Image, next)
}

export function DOMTextInput(props: DOMTextInputProps) {
  if (props.__tag && props.ref) return jsx(DOMTextInputWithViewportRef, props)
  return resolvedDOMTextInput(props)
}

function DOMTextInputWithViewportRef(props: DOMTextInputProps) {
  return withViewportRef(resolvedDOMTextInput, props)
}

function renderDOMTextInput(resolved: DOMTextInputProps) {
  if (
    resolved.onChange === undefined &&
    resolved.onInput === undefined &&
    resolved.onKeyDown === undefined &&
    !('__inheritedStyles' in resolved)
  ) {
    return jsx(TextInput, resolved)
  }
  const { __inheritedStyles: _, onChange, onInput, onKeyDown, ...hostProps } = resolved
  if (onChange === undefined && onInput === undefined && onKeyDown === undefined) {
    return jsx(TextInput, hostProps)
  }
  const next = hostProps as Record<string, unknown>
  // both dom change events come from the one react native onChange
  const change = textEntryChange(onChange, onInput)
  if (change) next.onChange = change
  if (onKeyDown) next.onKeyPress = keyFromKeyPress(onKeyDown)
  return jsx(TextInput, next)
}

const DOMRuntimeViewFrame = createComponent({
  ...viewStaticConfig,
  validStyles: { ...viewStaticConfig.validStyles, ...textStaticConfig.validStyles },
  neverSkipProps: domEventProps,
  Component: DOMView as any,
  neverFlatten: true,
  displayName: 'DOMRuntimeView',
})
const DOMRuntimeTextFrame = createComponent({
  ...textStaticConfig,
  neverSkipProps: domEventProps,
  Component: DOMText as any,
  neverFlatten: true,
  displayName: 'DOMRuntimeText',
})
const DOMRuntimeImageFrame = createComponent({
  ...viewStaticConfig,
  validStyles: { ...viewStaticConfig.validStyles, ...textStaticConfig.validStyles },
  neverSkipProps: domEventProps,
  Component: DOMImage as any,
  neverFlatten: true,
  displayName: 'DOMRuntimeImage',
})
const DOMRuntimeTextInputFrame = createComponent({
  ...textStaticConfig,
  neverSkipProps: domEventProps,
  Component: DOMTextInput as any,
  neverFlatten: true,
  displayName: 'DOMRuntimeTextInput',
})

function runtimeProps<T extends DOMMetadata>(props: T) {
  const { __styles, ...rest } = props
  const styles = mergeRuntimeStyles(__styles)
  if (!styles) return rest
  const inheritedStyles = Object.fromEntries(
    Object.entries(styles).filter(([property]) =>
      runtimeInheritedPassthroughProperties.has(property)
    )
  )
  return {
    ...rest,
    ...styles,
    ...(Object.keys(inheritedStyles).length && { __inheritedStyles: inheritedStyles }),
  }
}

function useRuntimeProps<T extends DOMMetadata>(props: T) {
  const [interaction, setInteraction] = useState({
    active: false,
    focus: false,
    hover: false,
  })
  const resolved = runtimeProps(props) as Record<string, any>
  const handler =
    (name: string, state: keyof typeof interaction, value: boolean) =>
    (event: unknown) => {
      setInteraction((previous) =>
        previous[state] === value ? previous : { ...previous, [state]: value }
      )
      resolved[name]?.(event)
    }
  return {
    ...resolved,
    forceStyle:
      resolved.forceStyle ||
      (interaction.active
        ? 'press'
        : interaction.focus
          ? 'focus'
          : interaction.hover
            ? 'hover'
            : undefined),
    onBlur: handler('onBlur', 'focus', false),
    onFocus: handler('onFocus', 'focus', true),
    onMouseEnter: handler('onMouseEnter', 'hover', true),
    onMouseLeave: handler('onMouseLeave', 'hover', false),
    onPointerCancel: handler('onPointerCancel', 'active', false),
    onPointerDown: handler('onPointerDown', 'active', true),
    onPointerEnter: handler('onPointerEnter', 'hover', true),
    onPointerLeave: handler('onPointerLeave', 'hover', false),
    onPointerUp: handler('onPointerUp', 'active', false),
    onPressIn: handler('onPressIn', 'active', true),
    onPressOut: handler('onPressOut', 'active', false),
  }
}

/** Dynamic-context variants injected only for style() programs that need runtime state. */
export function DOMRuntimeView(props: DOMViewProps) {
  return jsx(DOMRuntimeViewFrame, useRuntimeProps(props))
}

export function DOMRuntimeText(props: DOMTextProps) {
  return jsx(DOMRuntimeTextFrame, useRuntimeProps(props))
}

export function DOMRuntimeImage(props: DOMImageProps) {
  return jsx(DOMRuntimeImageFrame, useRuntimeProps(props))
}

export function DOMRuntimeTextInput(props: DOMTextInputProps) {
  return jsx(DOMRuntimeTextInputFrame, useRuntimeProps(props))
}
