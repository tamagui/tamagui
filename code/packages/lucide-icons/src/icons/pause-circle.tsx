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
      <_Circle cx="12" cy="12" r="10" stroke={color} />
      <Line x1="10" x2="10" y1="15" y2="9" stroke={color} />
      <Line x1="14" x2="14" y1="15" y2="9" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'PauseCircle'

export const PauseCircle = memo<IconProps>(themed(Icon))
