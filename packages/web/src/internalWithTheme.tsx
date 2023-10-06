import { useMemo } from 'react'

import { useTheme } from '.'
/** this is for tamagui babel plugin */
export const internalWithTheme = (Component: any, styleProvider: any) => {
  return (props) => {
    const theme = useTheme()
    const style = useMemo(() => {
      return Object.assign({}, styleProvider(theme))
    }, [theme])
    return <Component style={style} {...props} />
  }
}
