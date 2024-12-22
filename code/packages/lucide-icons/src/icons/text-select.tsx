import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Path } from 'react-native-svg'
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
      <Path d="M5 3a2 2 0 0 0-2 2" stroke={color} />
      <Path d="M19 3a2 2 0 0 1 2 2" stroke={color} />
      <Path d="M21 19a2 2 0 0 1-2 2" stroke={color} />
      <Path d="M5 21a2 2 0 0 1-2-2" stroke={color} />
      <Path d="M9 3h1" stroke={color} />
      <Path d="M9 21h1" stroke={color} />
      <Path d="M14 3h1" stroke={color} />
      <Path d="M14 21h1" stroke={color} />
      <Path d="M3 9v1" stroke={color} />
      <Path d="M21 9v1" stroke={color} />
      <Path d="M3 14v1" stroke={color} />
      <Path d="M21 14v1" stroke={color} />
      <Line x1="7" x2="15" y1="8" y2="8" stroke={color} />
      <Line x1="7" x2="17" y1="12" y2="12" stroke={color} />
      <Line x1="7" x2="13" y1="16" y2="16" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'TextSelect'

export const TextSelect = memo<IconProps>(themed(Icon))
