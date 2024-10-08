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
      <_Circle cx="11" cy="11" r="8" stroke={color} />
      <Line x1="21" x2="16.65" y1="21" y2="16.65" stroke={color} />
      <Line x1="8" x2="14" y1="11" y2="11" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ZoomOut'

export const ZoomOut = memo<IconProps>(themed(Icon))
