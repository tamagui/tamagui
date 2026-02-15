import type React from 'react'
import { cloneElement, createElement, isValidElement } from 'react'
import { composeRefs } from '@tamagui/compose-refs'
import type { TamaguiComponentState } from '../types'
import { mergeSlotStyleProps } from './mergeSlotStyleProps'

export type RenderProp<Props = Record<string, any>> =
  | string
  | React.ReactElement
  | ((props: Props, state: TamaguiComponentState) => React.ReactElement)

/**
 * Evaluates a render prop and returns the element to render.
 *
 * @param render - The render prop (tag string, JSX element, or function)
 * @param props - Props to pass to the rendered element (including ref)
 * @param state - Component state for render functions
 * @param defaultElement - Fallback element if render prop is not provided
 */
export function evaluateRenderProp(
  render: RenderProp | undefined,
  props: Record<string, any>,
  state: TamaguiComponentState,
  defaultElement: React.ReactElement<any>
): React.ReactElement {
  if (!render) {
    return defaultElement
  }

  const defaultChildren = defaultElement.props.children

  // String tag - swap element type, reuse props from defaultElement
  if (typeof render === 'string') {
    // on native, ignore lowercase tags (html/jsx elements like "div", "span")
    if (
      process.env.TAMAGUI_TARGET === 'native' &&
      render[0] === render[0].toLowerCase()
    ) {
      return defaultElement
    }
    return createElement(render, props, defaultChildren)
  }

  // Render function - call with props and state
  if (typeof render === 'function') {
    return render(props, state)
  }

  // JSX element - clone with merged props
  if (isValidElement(render)) {
    const renderProps = render.props as Record<string, any>
    const renderRef = renderProps?.ref

    // Fast path: no props to merge
    if (!renderProps || Object.keys(renderProps).length === 0) {
      if (renderRef) {
        return cloneElement(
          render,
          { ...props, ref: composeRefs(props.ref, renderRef) } as any,
          defaultChildren
        )
      }
      return cloneElement(render, props as any, defaultChildren)
    }

    // Merge props (component props as base, render props as overlay)
    const merged = mergeSlotStyleProps({ ...props }, renderProps)
    const children = renderProps.children ?? defaultChildren
    return cloneElement(render, merged as any, children)
  }

  return defaultElement
}
