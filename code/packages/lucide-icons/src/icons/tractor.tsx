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
      <Path
        d="m10 11 11 .9a1 1 0 0 1 .8 1.1l-.665 4.158a1 1 0 0 1-.988.842H20"
        stroke={color}
      />
      <Path d="M16 18h-5" stroke={color} />
      <Path d="M18 5a1 1 0 0 0-1 1v5.573" stroke={color} />
      <Path d="M3 4h8.129a1 1 0 0 1 .99.863L13 11.246" stroke={color} />
      <Path d="M4 11V4" stroke={color} />
      <Path d="M7 15h.01" stroke={color} />
      <Path d="M8 10.1V4" stroke={color} />
      <_Circle cx="18" cy="18" r="2" stroke={color} />
      <_Circle cx="7" cy="15" r="5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Tractor'

export const Tractor = memo<IconProps>(themed(Icon))
