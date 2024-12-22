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
      <_Circle cx="10" cy="7" r="1" stroke={color} />
      <_Circle cx="4" cy="20" r="1" stroke={color} />
      <Path d="M4.7 19.3 19 5" stroke={color} />
      <Path d="m21 3-3 1 2 2Z" stroke={color} />
      <Path d="M9.26 7.68 5 12l2 5" stroke={color} />
      <Path d="m10 14 5 2 3.5-3.5" stroke={color} />
      <Path d="m18 12 1-1 1 1-1 1Z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Usb'

export const Usb = memo<IconProps>(themed(Icon))
