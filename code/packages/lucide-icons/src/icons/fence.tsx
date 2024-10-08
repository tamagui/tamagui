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
      <Path d="M4 3 2 5v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z" stroke={color} />
      <Path d="M6 8h4" stroke={color} />
      <Path d="M6 18h4" stroke={color} />
      <Path d="m12 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z" stroke={color} />
      <Path d="M14 8h4" stroke={color} />
      <Path d="M14 18h4" stroke={color} />
      <Path d="m20 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Fence'

export const Fence = memo<IconProps>(themed(Icon))
