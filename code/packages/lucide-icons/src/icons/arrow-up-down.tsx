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
      <Path d="m21 16-4 4-4-4" stroke={color} />
      <Path d="M17 20V4" stroke={color} />
      <Path d="m3 8 4-4 4 4" stroke={color} />
      <Path d="M7 4v16" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ArrowUpDown'

export const ArrowUpDown = memo<IconProps>(themed(Icon))
