import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Line, Path } from 'react-native-svg'
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
      <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke={color} />
      <_Circle cx="9" cy="7" r="4" stroke={color} />
      <Line x1="17" x2="22" y1="8" y2="13" stroke={color} />
      <Line x1="22" x2="17" y1="8" y2="13" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'UserX'

export const UserX = memo<IconProps>(themed(Icon))
