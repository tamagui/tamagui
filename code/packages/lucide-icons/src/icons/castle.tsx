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
      <Path d="M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z" stroke={color} />
      <Path d="M18 11V4H6v7" stroke={color} />
      <Path d="M15 22v-4a3 3 0 0 0-3-3a3 3 0 0 0-3 3v4" stroke={color} />
      <Path d="M22 11V9" stroke={color} />
      <Path d="M2 11V9" stroke={color} />
      <Path d="M6 4V2" stroke={color} />
      <Path d="M18 4V2" stroke={color} />
      <Path d="M10 4V2" stroke={color} />
      <Path d="M14 4V2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Castle'

export const Castle = memo<IconProps>(themed(Icon))
