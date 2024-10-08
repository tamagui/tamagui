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
      <Polyline points="4 14 10 14 10 20" stroke={color} />
      <Polyline points="20 10 14 10 14 4" stroke={color} />
      <Line x1="14" x2="21" y1="10" y2="3" stroke={color} />
      <Line x1="3" x2="10" y1="21" y2="14" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Minimize2'

export const Minimize2 = memo<IconProps>(themed(Icon))
