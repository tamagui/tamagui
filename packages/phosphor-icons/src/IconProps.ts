import { ColorTokens, SizeTokens, ThemeTokens } from '@tamagui/core'
import { SvgProps } from 'react-native-svg'

export type IconContextProps = {
  size?: number | SizeTokens
  color?: (ColorTokens | ThemeTokens | (string & {})) | null
  style?: any
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'
}

export type IconProps = SvgProps & IconContextProps
