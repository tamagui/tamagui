import { ColorTokens, SizeTokens, ThemeTokens } from '@tamagui/core'
import { SvgProps } from 'react-native-svg'

export type BaseIconProps = {
  size?: number | SizeTokens
  strokeWidth?: number | SizeTokens
  color?: (ColorTokens | ThemeTokens | (string & {})) | null
  disableTheme?: boolean
  style?: SvgProps['style']
}

export type IconProps = Omit<SvgProps, keyof BaseIconProps> & BaseIconProps
