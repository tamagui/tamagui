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
      <Path d="M6 18h8" stroke={color} />
      <Path d="M3 22h18" stroke={color} />
      <Path d="M14 22a7 7 0 1 0 0-14h-1" stroke={color} />
      <Path d="M9 14h2" stroke={color} />
      <Path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" stroke={color} />
      <Path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Microscope'

export const Microscope = memo<IconProps>(themed(Icon))
