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
      <Path d="M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1" stroke={color} />
      <Path d="M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5" stroke={color} />
      <Path d="M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1" stroke={color} />
      <Path d="M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7" stroke={color} />
      <Path d="M9 7v10" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'TextCursorInput'

export const TextCursorInput = memo<IconProps>(themed(Icon))
