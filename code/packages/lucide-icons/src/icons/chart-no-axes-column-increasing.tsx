import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line } from 'react-native-svg'
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
      <Line x1="12" x2="12" y1="20" y2="10" stroke={color} />
      <Line x1="18" x2="18" y1="20" y2="4" stroke={color} />
      <Line x1="6" x2="6" y1="20" y2="16" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ChartNoAxesColumnIncreasing'

export const ChartNoAxesColumnIncreasing = memo<IconProps>(themed(Icon))
