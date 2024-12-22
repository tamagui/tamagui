import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Line, Path, Rect } from 'react-native-svg'
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
      <Path d="M16 18a4 4 0 0 0-8 0" stroke={color} />
      <_Circle cx="12" cy="11" r="3" stroke={color} />
      <Rect width="18" height="18" x="3" y="4" rx="2" stroke={color} />
      <Line x1="8" x2="8" y1="2" y2="4" stroke={color} />
      <Line x1="16" x2="16" y1="2" y2="4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Contact2'

export const Contact2 = memo<IconProps>(themed(Icon))
