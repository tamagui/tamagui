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
      <Path d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0" stroke={color} />
      <Path d="M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7" stroke={color} />
      <Path d="M21.82 10.1a9.93 9.93 0 0 1 0 3.8" stroke={color} />
      <Path d="M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69" stroke={color} />
      <Path d="M13.9 21.82a9.94 9.94 0 0 1-3.8 0" stroke={color} />
      <Path d="M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7" stroke={color} />
      <Path d="M2.18 13.9a9.93 9.93 0 0 1 0-3.8" stroke={color} />
      <Path d="M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69" stroke={color} />
      <_Circle cx="12" cy="12" r="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CircleDotDashed'

export const CircleDotDashed = memo<IconProps>(themed(Icon))
