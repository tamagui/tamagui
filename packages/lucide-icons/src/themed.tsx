import { getVariable, useTheme } from '@tamagui/core'
import { getSize } from '@tamagui/get-size'
import React from 'react'

export function themed<A extends React.FC>(Component: A) {
  const wrapped = (props: any) => {
    const theme = useTheme()
    const color = getVariable(
      (props.color in theme ? theme[props.color] : undefined) ||
        props.color ||
        (!props.disableTheme ? theme.color : null) ||
        '#000'
    )
    const size = typeof props.size === 'string' ? getSize(props.size).val : props.size

    return <Component {...props} color={color} size={size} />
  }
  return wrapped as unknown as A
}
