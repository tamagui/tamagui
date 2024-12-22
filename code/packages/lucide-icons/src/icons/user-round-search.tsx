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
      <_Circle cx="10" cy="8" r="5" stroke={color} />
      <Path d="M2 21a8 8 0 0 1 10.434-7.62" stroke={color} />
      <_Circle cx="18" cy="18" r="3" stroke={color} />
      <Path d="m22 22-1.9-1.9" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'UserRoundSearch'

export const UserRoundSearch = memo<IconProps>(themed(Icon))
