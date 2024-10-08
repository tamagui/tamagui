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
      <Polygon points="5 4 15 12 5 20 5 4" stroke={color} />
      <Line x1="19" x2="19" y1="5" y2="19" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SkipForward'

export const SkipForward = memo<IconProps>(themed(Icon))
