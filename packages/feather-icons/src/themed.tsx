import { useTheme } from '@tamagui/core'
import React from 'react'

export function themed<A extends React.FC>(Component: A) {
  const wrapped = (props: any) => {
    const theme = useTheme()
    const color =
      props.color || (!props.disableTheme ? theme['iconColor'] || theme.color : null) || '#000'
    return <Component {...props} color={color} />
  }
  return wrapped as unknown as A
}
