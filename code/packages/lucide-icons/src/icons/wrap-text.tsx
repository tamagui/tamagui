import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Path, Polyline } from 'react-native-svg'
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
      <Line x1="3" x2="21" y1="6" y2="6" stroke={color} />
      <Path d="M3 12h15a3 3 0 1 1 0 6h-4" stroke={color} />
      <Polyline points="16 16 14 18 16 20" stroke={color} />
      <Line x1="3" x2="10" y1="18" y2="18" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'WrapText'

export const WrapText = memo<IconProps>(themed(Icon))
