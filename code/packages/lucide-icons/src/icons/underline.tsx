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
      <Path d="M6 4v6a6 6 0 0 0 12 0V4" stroke={color} />
      <Line x1="4" x2="20" y1="20" y2="20" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Underline'

export const Underline = memo<IconProps>(themed(Icon))
