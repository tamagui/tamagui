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
      <Path d="M 20 4 A2 2 0 0 1 22 6" stroke={color} />
      <Path d="M 22 6 L 22 16.41" stroke={color} />
      <Path d="M 7 16 L 16 16" stroke={color} />
      <Path d="M 9.69 4 L 20 4" stroke={color} />
      <Path d="M14 8h.01" stroke={color} />
      <Path d="M18 8h.01" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
      <Path d="M20 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2" stroke={color} />
      <Path d="M6 8h.01" stroke={color} />
      <Path d="M8 12h.01" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'KeyboardOff'

export const KeyboardOff = memo<IconProps>(themed(Icon))
