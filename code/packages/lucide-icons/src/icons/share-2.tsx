import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Line } from 'react-native-svg'
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
      <_Circle cx="18" cy="5" r="3" stroke={color} />
      <_Circle cx="6" cy="12" r="3" stroke={color} />
      <_Circle cx="18" cy="19" r="3" stroke={color} />
      <Line x1="8.59" x2="15.42" y1="13.51" y2="17.49" stroke={color} />
      <Line x1="15.41" x2="8.59" y1="6.51" y2="10.49" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Share2'

export const Share2 = memo<IconProps>(themed(Icon))
