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
      <Path d="M13 12h8" stroke={color} />
      <Path d="M13 18h8" stroke={color} />
      <Path d="M13 6h8" stroke={color} />
      <Path d="M3 12h1" stroke={color} />
      <Path d="M3 18h1" stroke={color} />
      <Path d="M3 6h1" stroke={color} />
      <Path d="M8 12h1" stroke={color} />
      <Path d="M8 18h1" stroke={color} />
      <Path d="M8 6h1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Logs'

export const Logs = memo<IconProps>(themed(Icon))
