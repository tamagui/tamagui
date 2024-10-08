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
      <Polyline points="22 17 13.5 8.5 8.5 13.5 2 7" stroke={color} />
      <Polyline points="16 17 22 17 22 11" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'TrendingDown'

export const TrendingDown = memo<IconProps>(themed(Icon))
