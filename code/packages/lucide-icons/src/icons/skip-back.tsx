import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Polygon } from 'react-native-svg'
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
      <Polygon points="19 20 9 12 19 4 19 20" stroke={color} />
      <Line x1="5" x2="5" y1="19" y2="5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SkipBack'

export const SkipBack = memo<IconProps>(themed(Icon))
