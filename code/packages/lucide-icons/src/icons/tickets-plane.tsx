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
      <Path d="M10.5 17h1.227a2 2 0 0 0 1.345-.52L18 12" stroke={color} />
      <Path d="m12 13.5 3.75.5" stroke={color} />
      <Path d="m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8" stroke={color} />
      <Path d="M6 10V8" stroke={color} />
      <Path d="M6 14v1" stroke={color} />
      <Path d="M6 19v2" stroke={color} />
      <Rect x="2" y="8" width="20" height="13" rx="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'TicketsPlane'

export const TicketsPlane = memo<IconProps>(themed(Icon))
