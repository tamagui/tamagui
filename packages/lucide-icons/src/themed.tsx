import { getVariable, useTheme } from '@tamagui/core'
import React from 'react'

export function themed<A extends React.FC>(Component: A) {
  const wrapped = (props: any) => {
    const theme = useTheme()
    return (
      <Component
        {...props}
        color={getVariable(
          (props.color in theme ? theme[props.color] : undefined) ||
            props.color ||
            (!props.disableTheme ? theme.color : null) ||
            '#000'
        )}
        size={
          typeof props.size === 'string' ? getVariable(theme[props.size] || props.size) : props.size
        }
      />
    )
  }
  return wrapped as unknown as A
}
