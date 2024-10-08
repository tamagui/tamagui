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
      <Path d="m14 5-3 3 2 7 8-8-7-2Z" stroke={color} />
      <Path d="m14 5-3 3-3-3 3-3 3 3Z" stroke={color} />
      <Path d="M9.5 6.5 4 12l3 6" stroke={color} />
      <Path d="M3 22v-2c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2H3Z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'LampDesk'

export const LampDesk = memo<IconProps>(themed(Icon))
