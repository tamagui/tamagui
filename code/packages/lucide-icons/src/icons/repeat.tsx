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
      <Path d="m17 2 4 4-4 4" stroke={color} />
      <Path d="M3 11v-1a4 4 0 0 1 4-4h14" stroke={color} />
      <Path d="m7 22-4-4 4-4" stroke={color} />
      <Path d="M21 13v1a4 4 0 0 1-4 4H3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Repeat'

export const Repeat = memo<IconProps>(themed(Icon))
