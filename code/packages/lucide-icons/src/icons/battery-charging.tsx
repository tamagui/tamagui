import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Path } from 'react-native-svg'
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
      <Path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" stroke={color} />
      <Path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1" stroke={color} />
      <Path d="m11 7-3 5h4l-3 5" stroke={color} />
      <Line x1="22" x2="22" y1="11" y2="13" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BatteryCharging'

export const BatteryCharging = memo<IconProps>(themed(Icon))
