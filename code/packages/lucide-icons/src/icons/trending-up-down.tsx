import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
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
      <Path d="M14.828 14.828 21 21" stroke={color} />
      <Path d="M21 16v5h-5" stroke={color} />
      <Path d="m21 3-9 9-4-4-6 6" stroke={color} />
      <Path d="M21 8V3h-5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'TrendingUpDown'

export const TrendingUpDown = memo<IconProps>(themed(Icon))
