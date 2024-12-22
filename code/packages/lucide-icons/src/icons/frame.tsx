import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line } from 'react-native-svg'
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
      <Line x1="22" x2="2" y1="6" y2="6" stroke={color} />
      <Line x1="22" x2="2" y1="18" y2="18" stroke={color} />
      <Line x1="6" x2="6" y1="2" y2="22" stroke={color} />
      <Line x1="18" x2="18" y1="2" y2="22" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Frame'

export const Frame = memo<IconProps>(themed(Icon))
