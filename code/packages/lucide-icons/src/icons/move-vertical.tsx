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
      <Polyline points="8 18 12 22 16 18" stroke={color} />
      <Polyline points="8 6 12 2 16 6" stroke={color} />
      <Line x1="12" x2="12" y1="2" y2="22" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MoveVertical'

export const MoveVertical = memo<IconProps>(themed(Icon))
