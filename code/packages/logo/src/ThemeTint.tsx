import { type ThemeProps, Theme } from '@tamagui/web'
import type { JSX } from 'react/jsx-runtime'
import { useTint } from './useTint'

export const ThemeTint = ({
  disable,
  children,
  ...rest
}: ThemeProps & { disable?: boolean }): JSX.Element => {
  const curTint = useTint().tint
  return (
    <Theme {...rest} name={disable ? null : curTint}>
      {children}
    </Theme>
  )
}

export const ThemeTintAlt = ({
  children,
  disable,
  offset = 1,
  ...rest
}: ThemeProps & { disable?: boolean; offset?: number }): JSX.Element => {
  const curTint = useTint(offset).tintAlt
  const name = disable ? null : curTint
  return (
    <Theme name={name} {...rest}>
      {children}
    </Theme>
  )
}
