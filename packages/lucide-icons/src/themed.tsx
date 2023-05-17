import {
  getTokens,
  getVariable,
  getVariableValue,
  useProps,
  useTheme,
} from '@tamagui/core'
import { FC } from 'react'
import { IconProps } from './IconProps'

export function themed(Component: FC<IconProps>) {
  const wrapped = (propsIn: IconProps) => {
    const props = useProps(propsIn)
    const theme = useTheme()

    const defaultColor = props.color ?? 'black';

    const color = getVariable(
      (defaultColor in theme ? theme[defaultColor] : undefined) ||
        props.color ||
        (!props.disableTheme ? theme.color : null) ||
        '#000'
    )

    const size =
      typeof props.size === 'string'
        ? getVariableValue(getTokens().size[props.size] || props.size)
        : props.size

    const strokeWidth =
        typeof props.strokeWidth === 'string'
          ? getVariableValue(getTokens().size[props.strokeWidth] || props.strokeWidth)
          : (props.strokeWidth ?? '2')

    return <Component {...props} color={color} size={size} strokeWidth={strokeWidth} />
  }

  return wrapped
}
