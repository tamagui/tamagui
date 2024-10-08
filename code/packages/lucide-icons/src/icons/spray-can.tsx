import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
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
      <Path d="M3 3h.01" stroke={color} />
      <Path d="M7 5h.01" stroke={color} />
      <Path d="M11 7h.01" stroke={color} />
      <Path d="M3 7h.01" stroke={color} />
      <Path d="M7 9h.01" stroke={color} />
      <Path d="M3 11h.01" stroke={color} />
      <Rect width="4" height="4" x="15" y="5" stroke={color} />
      <Path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2" stroke={color} />
      <Path d="m13 14 8-2" stroke={color} />
      <Path d="m13 19 8-2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SprayCan'

export const SprayCan = memo<IconProps>(themed(Icon))
