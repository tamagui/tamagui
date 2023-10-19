import { useMemo } from 'react'

import { useTheme } from '.'
/** this is for tamagui babel plugin */
export const internalWithTheme = (Component: any, styleProvider: any) => {
  return (props) => {
    const theme = useTheme()
    const style = useMemo(() => {
      return Object.assign({}, styleProvider(theme, props.forTernary))
    }, [theme, ...(props.forTernary || [])])
    return <Component style={style} {...props} />
  }
}
