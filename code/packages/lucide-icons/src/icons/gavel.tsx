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
      <Path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8" stroke={color} />
      <Path d="m16 16 6-6" stroke={color} />
      <Path d="m8 8 6-6" stroke={color} />
      <Path d="m9 7 8 8" stroke={color} />
      <Path d="m21 11-8-8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Gavel'

export const Gavel = memo<IconProps>(themed(Icon))
