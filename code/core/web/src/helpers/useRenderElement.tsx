import type React from 'react'
import { cloneElement, createElement, isValidElement, version } from 'react'
import { composeRefs } from '@tamagui/compose-refs'
import { composeEventHandlers } from '@tamagui/helpers'
import type { TamaguiComponentState } from '../types'

const is19 = version.startsWith('19.')

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
    return createElement(render, props, defaultChildren)
  }

  // Render function - call with props and state
  if (typeof render === 'function') {
    return render(props, state)
  }

  // JSX element - clone with merged props only if render has props
  if (isValidElement(render)) {
    const renderProps = render.props as Record<string, any>
    const hasRenderProps = renderProps && Object.keys(renderProps).length > 0

    // Fast path: no props to merge
    if (!hasRenderProps) {
      const renderRef = is19 ? renderProps?.ref : (render as any).ref
      if (renderRef) {
        return cloneElement(
          render,
          { ...props, ref: composeRefs(props.ref, renderRef) } as any,
          defaultChildren
        )
      }
      return cloneElement(render, props as any, defaultChildren)
    }

    // Slow path: merge props
    const merged = mergeRenderProps(props, renderProps, render)
    const children = renderProps.children ?? defaultChildren
    return cloneElement(render, merged as any, children)
  }

  return defaultElement
}

/**
 * Merges props from the component with props from the render element.
 * Only called when render element has props to merge.
 */
function mergeRenderProps(
  componentProps: Record<string, any>,
  renderProps: Record<string, any>,
  renderElement: React.ReactElement
): Record<string, any> {
  // Start with component props, selectively override
  const merged: Record<string, any> = { ...componentProps }

  for (const key in renderProps) {
    if (key === 'children') continue // handled separately

    const renderValue = renderProps[key]

    if (key === 'ref') {
      const renderRef = is19 ? renderValue : (renderElement as any).ref
      if (renderRef && componentProps.ref) {
        merged.ref = composeRefs(componentProps.ref, renderRef)
      } else if (renderRef) {
        merged.ref = renderRef
      }
    } else if (key === 'style') {
      const componentStyle = componentProps.style
      if (componentStyle && renderValue) {
        merged.style = { ...componentStyle, ...renderValue }
      } else {
        merged.style = renderValue || componentStyle
      }
    } else if (key === 'className') {
      const componentClass = componentProps.className
      if (componentClass && renderValue) {
        merged.className = componentClass + ' ' + renderValue
      } else {
        merged.className = renderValue || componentClass
      }
    } else if (key[0] === 'o' && key[1] === 'n' && typeof renderValue === 'function') {
      // Event handler - compose if component also has one
      const componentHandler = componentProps[key]
      if (componentHandler) {
        merged[key] = composeEventHandlers(componentHandler, renderValue)
      } else {
        merged[key] = renderValue
      }
    } else {
      merged[key] = renderValue
    }
  }

  return merged
}
