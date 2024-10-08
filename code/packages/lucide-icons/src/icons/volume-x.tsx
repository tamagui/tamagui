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
      <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke={color} />
      <Line x1="22" x2="16" y1="9" y2="15" stroke={color} />
      <Line x1="16" x2="22" y1="9" y2="15" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'VolumeX'

export const VolumeX = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
