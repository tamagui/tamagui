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
      <Line x1="4" x2="4" y1="21" y2="14" stroke={color} />
      <Line x1="4" x2="4" y1="10" y2="3" stroke={color} />
      <Line x1="12" x2="12" y1="21" y2="12" stroke={color} />
      <Line x1="12" x2="12" y1="8" y2="3" stroke={color} />
      <Line x1="20" x2="20" y1="21" y2="16" stroke={color} />
      <Line x1="20" x2="20" y1="12" y2="3" stroke={color} />
      <Line x1="2" x2="6" y1="14" y2="14" stroke={color} />
      <Line x1="10" x2="14" y1="8" y2="8" stroke={color} />
      <Line x1="18" x2="22" y1="16" y2="16" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SlidersVertical'

export const SlidersVertical = memo<IconProps>(themed(Icon))
