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
      <Path d="M10 9a3 3 0 1 0 0 6" stroke={color} />
      <Path d="M2 12h1" stroke={color} />
      <Path d="M14 21V3" stroke={color} />
      <Path d="M10 4V3" stroke={color} />
      <Path d="M10 21v-1" stroke={color} />
      <Path d="m3.64 18.36.7-.7" stroke={color} />
      <Path d="m4.34 6.34-.7-.7" stroke={color} />
      <Path d="M14 12h8" stroke={color} />
      <Path d="m17 4-3 3" stroke={color} />
      <Path d="m14 17 3 3" stroke={color} />
      <Path d="m21 15-3-3 3-3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SunSnow'

export const SunSnow = memo<IconProps>(themed(Icon))
