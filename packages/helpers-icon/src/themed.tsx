import { getTokenValue, getVariable, useProps, useTheme } from '@tamagui/core'
import React from 'react'

import { IconProps } from './IconProps'

export function themed(Component: React.FC<IconProps>) {
  const wrapped = (propsIn: IconProps) => {
    const props = useProps(propsIn)
    const theme = useTheme()

    const defaultColor = props.color ?? 'black'
    const color = getVariable(
      (defaultColor in theme ? theme[defaultColor] : undefined) ||
        props.color ||
        (!props.disableTheme ? theme.color : null) ||
        '#000'
    )

    const size =
      typeof props.size === 'string' ? getTokenValue(props.size, 'size') : props.size

    const strokeWidth =
      typeof props.strokeWidth === 'string'
        ? getTokenValue(props.strokeWidth, 'size')
        : props.strokeWidth ?? '2'

    return <Component {...props} color={color} size={size} strokeWidth={strokeWidth} />
  }

  return wrapped
}
