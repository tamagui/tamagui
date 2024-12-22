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
      <Path d="M8 2v4" stroke={color} />
      <Path d="M12 2v4" stroke={color} />
      <Path d="M16 2v4" stroke={color} />
      <Path d="M16 4h2a2 2 0 0 1 2 2v2" stroke={color} />
      <Path d="M20 12v2" stroke={color} />
      <Path d="M20 18v2a2 2 0 0 1-2 2h-1" stroke={color} />
      <Path d="M13 22h-2" stroke={color} />
      <Path d="M7 22H6a2 2 0 0 1-2-2v-2" stroke={color} />
      <Path d="M4 14v-2" stroke={color} />
      <Path d="M4 8V6a2 2 0 0 1 2-2h2" stroke={color} />
      <Path d="M8 10h6" stroke={color} />
      <Path d="M8 14h8" stroke={color} />
      <Path d="M8 18h5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'NotepadTextDashed'

export const NotepadTextDashed = memo<IconProps>(themed(Icon))
