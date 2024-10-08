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
      <Path d="M2 13a6 6 0 1 0 12 0 4 4 0 1 0-8 0 2 2 0 0 0 4 0" stroke={color} />
      <_Circle cx="10" cy="13" r="8" stroke={color} />
      <Path d="M2 21h12c4.4 0 8-3.6 8-8V7a2 2 0 1 0-4 0v6" stroke={color} />
      <Path d="M18 3 19.1 5.2" stroke={color} />
      <Path d="M22 3 20.9 5.2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Snail'

export const Snail = memo<IconProps>(themed(Icon))
