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
      <Path d="M2 21a8 8 0 0 1 11.873-7" stroke={color} />
      <_Circle cx="10" cy="8" r="5" stroke={color} />
      <Path d="m17 17 5 5" stroke={color} />
      <Path d="m22 17-5 5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'UserRoundX'

export const UserRoundX = memo<IconProps>(themed(Icon))
