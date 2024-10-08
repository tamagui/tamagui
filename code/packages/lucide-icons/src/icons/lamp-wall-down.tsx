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
      <Path d="M11 13h6l3 7H8l3-7Z" stroke={color} />
      <Path d="M14 13V8a2 2 0 0 0-2-2H8" stroke={color} />
      <Path d="M4 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4v6Z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'LampWallDown'

export const LampWallDown = memo<IconProps>(themed(Icon))
