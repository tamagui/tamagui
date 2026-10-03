import type {
  ColorTokens,
  FontSizeTokens,
  GetFinalProps,
  SizeTokens,
  StackStyleBase,
  ThemeTokens,
} from '@tamagui/core'
import type { SvgProps } from 'react-native-svg'

export interface IconStyleProps extends StackStyleBase {
  size?: number | FontSizeTokens
  strokeWidth?: number | SizeTokens
  color?: string
}

export type NonStyleProps = Omit<SvgProps, keyof IconStyleProps> & {
  disableTheme?: boolean
  style?: SvgProps['style']
}

export type IconProps = GetFinalProps<NonStyleProps, IconStyleProps, {}>
