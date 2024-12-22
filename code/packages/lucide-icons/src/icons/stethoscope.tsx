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
      <Path d="M11 2v2" stroke={color} />
      <Path d="M5 2v2" stroke={color} />
      <Path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" stroke={color} />
      <Path d="M8 15a6 6 0 0 0 12 0v-3" stroke={color} />
      <_Circle cx="20" cy="10" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Stethoscope'

export const Stethoscope = memo<IconProps>(themed(Icon))
