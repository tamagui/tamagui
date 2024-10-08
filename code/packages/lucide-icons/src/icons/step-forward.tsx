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
      <Line x1="6" x2="6" y1="4" y2="20" stroke={color} />
      <Polygon points="10,4 20,12 10,20" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'StepForward'

export const StepForward = memo<IconProps>(themed(Icon))
