import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
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
      <Path d="M18 21a8 8 0 0 0-16 0" stroke={color} />
      <_Circle cx="10" cy="8" r="5" stroke={color} />
      <Path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'UsersRound'

export const UsersRound = memo<IconProps>(themed(Icon))
