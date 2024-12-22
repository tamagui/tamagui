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
      <Line x1="2" x2="5" y1="12" y2="12" stroke={color} />
      <Line x1="19" x2="22" y1="12" y2="12" stroke={color} />
      <Line x1="12" x2="12" y1="2" y2="5" stroke={color} />
      <Line x1="12" x2="12" y1="19" y2="22" stroke={color} />
      <_Circle cx="12" cy="12" r="7" stroke={color} />
      <_Circle cx="12" cy="12" r="3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'LocateFixed'

export const LocateFixed = memo<IconProps>(themed(Icon))
