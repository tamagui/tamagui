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
      <Path d="M20 9V7a2 2 0 0 0-2-2h-6" stroke={color} />
      <Path d="m15 2-3 3 3 3" stroke={color} />
      <Path d="M20 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'RotateCcwSquare'

export const RotateCcwSquare = memo<IconProps>(themed(Icon))
