import { useTheme } from './hooks/useTheme'

/** internal: this is for tamagui babel plugin usage only */

export const internalWithTheme = (Component: any, styleProvider: any) => (props) => {
  const { expressions, ...rest } = props
  const theme = useTheme()
  return <Component style={styleProvider(theme, expressions)} {...rest} />
}
