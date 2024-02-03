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

export function themed(
  Component: React.FC<IconProps>,
  opts: ThemedOptions = {
    defaultThemeColor: process.env.DEFAULT_ICON_THEME_COLOR || '$color',
    defaultStrokeWidth: 2,
    fallbackColor: '#000',
  }
) {
  const wrapped = (propsIn: IconProps) => {
    const [props, style, theme] = usePropsAndStyle(propsIn, {
      forComponent: Text,
      resolveValues: 'web', // iOS doesnt support dynamic values for SVG so only optimize on web
    })

    const defaultColor = style.color ?? opts.defaultThemeColor

    const color = getVariable(
      (defaultColor ? theme[defaultColor as string] : undefined) ||
        style.color ||
        (!props.disableTheme ? theme.color : null) ||
        opts.fallbackColor
    )

    const size =
      typeof props.size === 'string'
        ? getTokenValue(props.size as any, 'size')
        : props.size

    const strokeWidth =
      typeof props.strokeWidth === 'string'
        ? getTokenValue(props.strokeWidth as any, 'size')
        : props.strokeWidth ?? `${opts.defaultStrokeWidth}`

    return (
      <Component
        {...props}
        color={color}
        size={size}
        strokeWidth={strokeWidth}
        style={style as any}
      />
    )
  }

  return wrapped
}
