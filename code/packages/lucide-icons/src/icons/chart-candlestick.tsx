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
      <Path d="M9 5v4" stroke={color} />
      <Rect width="4" height="6" x="7" y="9" rx="1" stroke={color} />
      <Path d="M9 15v2" stroke={color} />
      <Path d="M17 3v2" stroke={color} />
      <Rect width="4" height="8" x="15" y="5" rx="1" stroke={color} />
      <Path d="M17 13v3" stroke={color} />
      <Path d="M3 3v16a2 2 0 0 0 2 2h16" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ChartCandlestick'

export const ChartCandlestick = memo<IconProps>(themed(Icon))
