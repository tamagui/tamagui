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
      <Path d="M2 10s3-3 3-8" stroke={color} />
      <Path d="M22 10s-3-3-3-8" stroke={color} />
      <Path d="M10 2c0 4.4-3.6 8-8 8" stroke={color} />
      <Path d="M14 2c0 4.4 3.6 8 8 8" stroke={color} />
      <Path d="M2 10s2 2 2 5" stroke={color} />
      <Path d="M22 10s-2 2-2 5" stroke={color} />
      <Path d="M8 15h8" stroke={color} />
      <Path d="M2 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" stroke={color} />
      <Path d="M14 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Theater'

export const Theater = memo<IconProps>(themed(Icon))
