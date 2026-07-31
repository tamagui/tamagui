import { jsx } from 'react/jsx-runtime'
import { Image, Pressable, Text, TextInput, View } from 'react-native'

import {
  clickFromPress,
  errorFromImage,
  keyFromKeyPress,
  loadFromImage,
  textEntryChange,
} from './adapters'
import type {
  DOMImageProps,
  DOMTextInputProps,
  DOMTextProps,
  DOMViewProps,
} from './contract'

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
 * 1. No hooks. Not one, on any path. That is also why the tests can call these
 *    as plain functions: a hook would throw outside a renderer.
 * 2. No context reads. React Strict DOM reads a display-inside context and a
 *    text-ancestor context per element; the compiler knows both statically, so
 *    the block emulation is already in the style object by the time it gets
 *    here and nested react native Text inherits text styles on its own.
 * 3. Nothing is allocated for a prop that was not passed. An element with no
 *    handlers forwards the props object it was given, with no copy.
 */

export function DOMView(props: DOMViewProps) {
  const { onClick } = props
  // a plain view is the common case and forwards without copying
  if (onClick === undefined) return jsx(View, props)
  // react native's View has no press handling, so a clickable one is a Pressable
  const { onClick: _, ...rest } = props
  ;(rest as Record<string, unknown>).onPress = clickFromPress(onClick)
  return jsx(Pressable, rest)
}

export function DOMText(props: DOMTextProps) {
  const { onClick } = props
  if (onClick === undefined) return jsx(Text, props)
  // react native's Text presses on its own, so this stays one element
  const { onClick: _, ...rest } = props
  ;(rest as Record<string, unknown>).onPress = clickFromPress(onClick)
  return jsx(Text, rest)
}

export function DOMImage(props: DOMImageProps) {
  const { onClick, onLoad, onError } = props
  if (onClick === undefined && onLoad === undefined && onError === undefined) {
    return jsx(Image, props)
  }
  const { onClick: _, onLoad: __, onError: ___, ...rest } = props
  const next = rest as Record<string, unknown>
  if (onClick) next.onPress = clickFromPress(onClick)
  if (onLoad) next.onLoad = loadFromImage(onLoad)
  if (onError) next.onError = errorFromImage(onError)
  return jsx(Image, next)
}

export function DOMTextInput(props: DOMTextInputProps) {
  const { onChange, onInput, onKeyDown } = props
  if (onChange === undefined && onInput === undefined && onKeyDown === undefined) {
    return jsx(TextInput, props)
  }
  const { onChange: _, onInput: __, onKeyDown: ___, ...rest } = props
  const next = rest as Record<string, unknown>
  // both dom change events come from the one react native onChange
  const change = textEntryChange(onChange, onInput)
  if (change) next.onChange = change
  if (onKeyDown) next.onKeyPress = keyFromKeyPress(onKeyDown)
  return jsx(TextInput, next)
}
