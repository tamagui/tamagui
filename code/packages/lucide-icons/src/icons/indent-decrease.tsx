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
      <Polyline points="7 8 3 12 7 16" stroke={color} />
      <Line x1="21" x2="11" y1="12" y2="12" stroke={color} />
      <Line x1="21" x2="11" y1="6" y2="6" stroke={color} />
      <Line x1="21" x2="11" y1="18" y2="18" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'IndentDecrease'

export const IndentDecrease = memo<IconProps>(themed(Icon))
