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
      <Path d="M15 6.5V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3.5" stroke={color} />
      <Path d="M9 18h8" stroke={color} />
      <Path d="M18 3h-3" stroke={color} />
      <Path d="M11 3a6 6 0 0 0-6 6v11" stroke={color} />
      <Path d="M5 13h4" stroke={color} />
      <Path d="M17 10a4 4 0 0 0-8 0v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2Z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FireExtinguisher'

export const FireExtinguisher = memo<IconProps>(themed(Icon))
