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
      <Line x1="3" x2="21" y1="12" y2="12" stroke={color} />
      <Polyline points="8 8 12 4 16 8" stroke={color} />
      <Polyline points="16 16 12 20 8 16" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SeparatorHorizontal'

export const SeparatorHorizontal = memo<IconProps>(themed(Icon))
