import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <Rect width="20" height="8" x="2" y="14" rx="2" stroke={color} />
      <Path d="M6.01 18H6" stroke={color} />
      <Path d="M10.01 18H10" stroke={color} />
      <Path d="M15 10v4" stroke={color} />
      <Path d="M17.84 7.17a4 4 0 0 0-5.66 0" stroke={color} />
      <Path d="M20.66 4.34a8 8 0 0 0-11.31 0" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Router'

export const Router = memo<IconProps>(themed(Icon))
