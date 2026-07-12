import type {
  ColorTokens,
  GetFinalProps,
  SizeTokens,
  StackStyleBase,
  ThemeTokens,
} from '@tamagui/core'
import type { SvgProps } from 'react-native-svg'

export interface IconStyleProps extends StackStyleBase {
  size?: number | SizeTokens
  strokeWidth?: number | SizeTokens
  color?: string
}

export type NonStyleProps = Omit<SvgProps, keyof IconStyleProps> & {
  disableTheme?: boolean
  style?: SvgProps['style']
  // styleMode: icons accept a className whose color-*/size-* is reconstructed to the
  // color/size props in themed() (icons aren't createComponent components)
  className?: string
}

export type IconProps = GetFinalProps<NonStyleProps, IconStyleProps, {}>
