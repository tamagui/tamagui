import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Polyline } from 'react-native-svg'
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
      <Line x1="12" x2="12" y1="3" y2="21" stroke={color} />
      <Polyline points="8 8 4 12 8 16" stroke={color} />
      <Polyline points="16 16 20 12 16 8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SeparatorVertical'

export const SeparatorVertical = memo<IconProps>(themed(Icon))
