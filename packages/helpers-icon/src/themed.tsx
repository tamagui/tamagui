import { getTokenValue, getVariable, useProps, useTheme } from '@tamagui/core'
import React from 'react'
import { SvgProps } from 'react-native-svg'

import { IconProps } from './IconProps'

type ThemedOptions = {
  defaultThemeColor?: string
  defaultStrokeWidth?: number
  fallbackColor?: string
}

export function themed(
  Component: React.FC<SvgProps>,
  opts: ThemedOptions = {
    defaultThemeColor: 'black',
    defaultStrokeWidth: 2,
    fallbackColor: '#000',
  }
) {
  const wrapped = (propsIn: IconProps) => {
    const props = useProps(propsIn)
    const theme = useTheme()

    const defaultColor = props.color ?? opts.defaultThemeColor
    const color = getVariable(
      (defaultColor ? theme[defaultColor] : undefined) ||
        props.color ||
        (!props.disableTheme ? theme.color : null) ||
        opts.fallbackColor
    )

    const size =
      typeof props.size === 'string' ? getTokenValue(props.size, 'size') : props.size

    const strokeWidth =
      typeof props.strokeWidth === 'string'
        ? getTokenValue(props.strokeWidth, 'size')
        : props.strokeWidth ?? `${opts.defaultStrokeWidth}`

    return (
      <Component
        {...props}
        color={color}
        width={size}
        height={size}
        strokeWidth={strokeWidth}
      />
    )
  }

  return wrapped
}
