import { mergeSlotStyleProps } from './mergeSlotStyleProps'

/**
 * Merges props from a render element with viewProps from Tamagui.
 * viewProps takes precedence, elementProps provides fallbacks.
 * Style/className are merged, refs and event handlers are composed.
 */
export function mergeRenderElementProps(
  elementProps: Record<string, any>,
  viewProps: Record<string, any>,
  children: any
): Record<string, any> {
  // elementProps as base, viewProps as overlay (viewProps wins)
  const merged = mergeSlotStyleProps({ ...elementProps }, viewProps)
  merged.children = children
  return merged
}
