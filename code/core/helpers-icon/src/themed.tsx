import { getTokenValue, getVariable, usePropsAndStyle, Text } from '@tamagui/core'
import React from 'react'

import type { IconProps } from './IconProps'

// sad fix https://github.com/tamagui/tamagui/issues/1812
React['keep']

type ThemedOptions = {
  defaultThemeColor?: string
  defaultStrokeWidth?: number
  fallbackColor?: string
}

type Opts = ThemedOptions & {
  noClassNames?: boolean
}

export function themed(
  Component: React.FC<IconProps>,
  opts: Opts = {
    defaultThemeColor: process.env.DEFAULT_ICON_THEME_COLOR || '$color',
    defaultStrokeWidth: 2,
    fallbackColor: '#000',
  }
) {
  const wrapped = (propsIn: IconProps) => {
    const [props, style, theme] = usePropsAndStyle(propsIn, {
      ...opts,
      forComponent: Text,
      resolveValues: 'web', // iOS doesnt support dynamic values for SVG so only optimize on web
    })

    const defaultColor = opts.defaultThemeColor

    const colorIn =
      (defaultColor ? theme[defaultColor as string] : undefined) ||
      style.color ||
      (!props.disableTheme ? theme.color : null) ||
      opts.fallbackColor

    const color = getVariable(colorIn)

    const size =
      typeof props.size === 'string'
        ? getTokenValue(props.size as any, 'size')
        : props.size

    const strokeWidth =
      typeof props.strokeWidth === 'string'
        ? getTokenValue(props.strokeWidth as any, 'size')
        : (props.strokeWidth ?? `${opts.defaultStrokeWidth}`)

    const finalProps = {
      ...props,
      color,
      size,
      strokeWidth,
      style: style as any,
    }

    return <Component {...finalProps} />
  }

  return wrapped
}
