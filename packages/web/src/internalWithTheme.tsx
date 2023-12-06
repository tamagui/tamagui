import { useMemo } from 'react'

import { useTheme } from './hooks/useTheme'

/** internal: this is for tamagui babel plugin usage only */

export const internalWithTheme = (
  Component: any,
  styleProvider: any,
  memoArgs: string[]
) => {
  return (props) => {
    const { forTernary, ...rest } = props
    const theme = useTheme()
    return <Component style={styleProvider(theme, props.forTernary)} {...rest} />
  }
}
