import { useTheme, variableToString } from '@tamagui/core'
import React from 'react'

export function themed<A extends React.FC>(Component: A) {
  const wrapped = (props: any) => {
    const theme = useTheme()
    const color = props.color || (!props.disableTheme ? theme.color : null) || '#000'
    return <Component {...props} color={variableToString(color)} />
  }
  return wrapped as unknown as A
}
