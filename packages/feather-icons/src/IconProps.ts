import { SvgProps } from 'react-native-svg'

export type IconProps = Omit<SvgProps, 'onPress' | 'onPressIn' | 'onPressOut'> & {
  size?: number
  color?: string
  style?: any
}
