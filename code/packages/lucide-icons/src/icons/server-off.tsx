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
      <Path d="M7 2h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-5" stroke={color} />
      <Path d="M10 10 2.5 2.5C2 2 2 2.5 2 5v3a2 2 0 0 0 2 2h6z" stroke={color} />
      <Path d="M22 17v-1a2 2 0 0 0-2-2h-1" stroke={color} />
      <Path d="M4 14a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16.5l1-.5.5.5-8-8H4z" stroke={color} />
      <Path d="M6 18h.01" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ServerOff'

export const ServerOff = memo<IconProps>(themed(Icon))
