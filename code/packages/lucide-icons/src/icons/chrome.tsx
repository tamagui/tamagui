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
      <_Circle cx="12" cy="12" r="4" stroke={color} />
      <Line x1="21.17" x2="12" y1="8" y2="8" stroke={color} />
      <Line x1="3.95" x2="8.54" y1="6.06" y2="14" stroke={color} />
      <Line x1="10.88" x2="15.46" y1="21.94" y2="14" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Chrome'

export const Chrome = memo<IconProps>(themed(Icon))
