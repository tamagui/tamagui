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
      <Polyline points="18 8 22 12 18 16" stroke={color} />
      <Polyline points="6 8 2 12 6 16" stroke={color} />
      <Line x1="2" x2="22" y1="12" y2="12" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MoveHorizontal'

export const MoveHorizontal = memo<IconProps>(themed(Icon))
