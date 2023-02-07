import {
  getTokens,
  getVariable,
  getVariableValue,
  useMediaPropsActive,
  useTheme,
} from '@tamagui/core'
import React from 'react'

export function themed<A extends React.FC>(Component: A) {
  const wrapped = (propsIn: any) => {
    const props = useMediaPropsActive(propsIn)
    const theme = useTheme()
    const color = getVariable(
      (props.color in theme ? theme[props.color] : undefined) ||
        props.color ||
        (!props.disableTheme ? theme.color : null) ||
        '#000'
    )
    const size =
      typeof props.size === 'string'
        ? getVariableValue(getTokens().size[props.size] || props.size)
        : props.size

    // @ts-ignore
    return <Component {...props} color={color} size={size} />
  }
  return wrapped as unknown as A
}
