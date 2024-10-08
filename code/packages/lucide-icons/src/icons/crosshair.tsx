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
      <Line x1="22" x2="18" y1="12" y2="12" stroke={color} />
      <Line x1="6" x2="2" y1="12" y2="12" stroke={color} />
      <Line x1="12" x2="12" y1="6" y2="2" stroke={color} />
      <Line x1="12" x2="12" y1="22" y2="18" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Crosshair'

export const Crosshair = memo<IconProps>(themed(Icon))
