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
      <Path d="M5 8V5c0-1 1-2 2-2h10c1 0 2 1 2 2v3" stroke={color} />
      <Path d="M19 16v3c0 1-1 2-2 2H7c-1 0-2-1-2-2v-3" stroke={color} />
      <Line x1="4" x2="20" y1="12" y2="12" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SquareSplitVertical'

export const SquareSplitVertical = memo<IconProps>(themed(Icon))
