import React from 'react'
import type { ColorProp } from './useCurrentColor'
import { useCurrentColor } from './useCurrentColor'

export type IconProps = {
  width: number
  height: number
  color: string
}

type IconPropsTransformer = (el: any, props: IconProps) => Record<string, any>

let customIconPropsTransformer: IconPropsTransformer | null = null

/**
 * Configure how icon props are transformed before being passed to icon components.
 * This allows customization for different icon libraries that may expect different props.
 *
 * @example
 * // For a library that uses 'size' instead of width/height:
 * configureIconProps((el, props) => ({
 *   size: props.width,
 *   color: props.color,
 * }))
 */
export function configureIconProps(transformer: IconPropsTransformer | null) {
  customIconPropsTransformer = transformer
}

export const useGetThemedIcon = (props: { color: ColorProp; size: number }) => {
  const color = useCurrentColor(props.color)

  return (el: any) => {
    if (!el) return el

    // Calculate the icon props
    const iconProps: IconProps = {
      width: props.size,
      height: props.size,
      color,
    }

    // Allow user customization of props
    const finalProps = customIconPropsTransformer
      ? customIconPropsTransformer(el, iconProps)
      : iconProps

    // Single logic for clone vs create
    if (React.isValidElement(el)) {
      return React.cloneElement(el, {
        ...finalProps,
        // @ts-expect-error
        ...el.props,
      })
    }

    return React.createElement(el, finalProps)
  }
}
