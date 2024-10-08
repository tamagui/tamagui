import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
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
      <Path d="M18 11h-4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4" stroke={color} />
      <Path d="M6 7v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" stroke={color} />
      <Rect width="16" height="5" x="4" y="2" rx="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'PillBottle'

export const PillBottle = memo<IconProps>(themed(Icon))
