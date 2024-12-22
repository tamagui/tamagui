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
      <Line x1="19" x2="5" y1="5" y2="19" stroke={color} />
      <_Circle cx="6.5" cy="6.5" r="2.5" stroke={color} />
      <_Circle cx="17.5" cy="17.5" r="2.5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Percent'

export const Percent = memo<IconProps>(themed(Icon))
