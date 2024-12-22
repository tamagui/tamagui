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
      <Path d="M17 12H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h14" stroke={color} />
      <Path d="M18 8c0-2.5-2-2.5-2-5" stroke={color} />
      <Path d="M21 16a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" stroke={color} />
      <Path d="M22 8c0-2.5-2-2.5-2-5" stroke={color} />
      <Path d="M7 12v4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Cigarette'

export const Cigarette = memo<IconProps>(themed(Icon))
