import { useMemo } from 'react'

import { useTheme } from './hooks/useTheme'

/** internal: this is for tamagui babel plugin usage only */

export const internalWithTheme = (Component: any, styleProvider: any) => {
  return (props) => {
    const { expressions, ...rest } = props
    const theme = useTheme()
    return <Component style={styleProvider(theme, props.expressions)} {...rest} />
  }
}
