import { useMemo } from 'react'

import { useTheme } from './hooks/useTheme'

/** internal: this is for tamagui babel plugin usage only */

export const internalWithTheme = (
  Component: any,
  styleProvider: any,
  memoArgs: string[]
) => {
  return (props) => {
    const theme = useTheme()
    return <Component style={useMemo(() => styleProvider(theme), memoArgs)} {...props} />
  }
}
