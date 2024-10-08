import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Polygon } from 'react-native-svg'
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
      <Line x1="18" x2="18" y1="20" y2="4" stroke={color} />
      <Polygon points="14,20 4,12 14,4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'StepBack'

export const StepBack = memo<IconProps>(themed(Icon))
