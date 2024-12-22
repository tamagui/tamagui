import {
  getTokenValue,
  getVariable,
  Text,
  usePropsAndStyle,
  type ResolveVariableAs,
} from '@tamagui/core'
import React from 'react'

import type { IconProps } from './IconProps'

// sad fix https://github.com/tamagui/tamagui/issues/1812
React['keep']

type Options = {
  noClass?: boolean
  defaultThemeColor?: string
  defaultStrokeWidth?: number
  fallbackColor?: string
  resolveValues?: ResolveVariableAs
}

export function themed(Component: React.FC<IconProps>, optsIn: Options = {}) {
  const opts: Options = {
    defaultThemeColor: process.env.DEFAULT_ICON_THEME_COLOR || '$color',
    defaultStrokeWidth: 2,
    fallbackColor: '#000',
    resolveValues: (process.env.TAMAGUI_ICON_COLOR_RESOLVE as any) || 'auto',
    ...optsIn,
  }

  const wrapped = (propsIn: IconProps) => {
    const [props, style, theme] = usePropsAndStyle(propsIn, {
      ...opts,
      forComponent: Text,
      resolveValues: opts.resolveValues,
    })

    const defaultColor = opts.defaultThemeColor

    const colorIn =
      style.color ||
      (defaultColor ? theme[defaultColor as string] : undefined) ||
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
