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
      <_Circle cx="12" cy="6" r="1" stroke={color} />
      <Line x1="5" x2="19" y1="12" y2="12" stroke={color} />
      <_Circle cx="12" cy="18" r="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Divide'

export const Divide = memo<IconProps>(themed(Icon))
