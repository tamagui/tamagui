import { useTheme } from './hooks/useTheme'

/** internal: this is for tamagui babel plugin usage only */

export const internalWithTheme =
  (Component: any, styleProvider: (theme: any, expressions: any[]) => Object) =>
  (props: any) => {
    const { _expressions = [], ...rest } = props
    const theme = useTheme()
    return <Component style={styleProvider(theme, _expressions)} {...rest} />
  }
