import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Path } from 'react-native-svg'
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
      <Line x1="2" x2="22" y1="12" y2="12" stroke={color} />
      <Line x1="12" x2="12" y1="2" y2="22" stroke={color} />
      <Path d="m20 16-4-4 4-4" stroke={color} />
      <Path d="m4 8 4 4-4 4" stroke={color} />
      <Path d="m16 4-4 4-4-4" stroke={color} />
      <Path d="m8 20 4-4 4 4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Snowflake'

export const Snowflake = memo<IconProps>(themed(Icon))
