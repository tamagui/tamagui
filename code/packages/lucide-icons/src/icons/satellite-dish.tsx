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
      <Path d="M4 10a7.31 7.31 0 0 0 10 10Z" stroke={color} />
      <Path d="m9 15 3-3" stroke={color} />
      <Path d="M17 13a6 6 0 0 0-6-6" stroke={color} />
      <Path d="M21 13A10 10 0 0 0 11 3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SatelliteDish'

export const SatelliteDish = memo<IconProps>(themed(Icon))
