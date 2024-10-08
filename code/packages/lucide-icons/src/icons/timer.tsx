import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Line } from 'react-native-svg'
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
      <Line x1="10" x2="14" y1="2" y2="2" stroke={color} />
      <Line x1="12" x2="15" y1="14" y2="11" stroke={color} />
      <_Circle cx="12" cy="14" r="8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Timer'

export const Timer = memo<IconProps>(themed(Icon))
