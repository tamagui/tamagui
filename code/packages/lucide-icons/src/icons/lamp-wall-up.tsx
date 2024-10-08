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
      <Path d="M11 4h6l3 7H8l3-7Z" stroke={color} />
      <Path d="M14 11v5a2 2 0 0 1-2 2H8" stroke={color} />
      <Path d="M4 15h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4v-6Z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'LampWallUp'

export const LampWallUp = memo<IconProps>(themed(Icon))
