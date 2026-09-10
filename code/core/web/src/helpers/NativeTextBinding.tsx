import { createElement, type ReactElement } from 'react'
import type { AnimationDriverLike } from '../types'
import type { AnimatedTextChannel, NativeTextMetrics } from './nativeTextMetrics'

// only inherited animated text mounts this hook boundary; ordinary text keeps its host.
export function NativeTextBinding({
  element,
  useTextMetrics,
  inheritedText,
  lineHeight,
  isInput,
}: {
  element: ReactElement<any>
  useTextMetrics: NonNullable<AnimationDriverLike['useTextMetrics']>
  inheritedText: AnimatedTextChannel
  lineHeight: NativeTextMetrics['lineHeight']
  isInput?: boolean
}) {
  const binding = useTextMetrics({ inheritedText, lineHeight })
  if (!binding.style) return element
  const Host = isInput ? binding.TextInput : binding.Text
  return createElement(Host, {
    ...element.props,
    style: [element.props.style, binding.style],
  })
}
