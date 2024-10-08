import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Polyline } from 'react-native-svg'
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
      <Polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke={color} />
      <Polyline points="16 7 22 7 22 13" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'TrendingUp'

export const TrendingUp = memo<IconProps>(themed(Icon))
