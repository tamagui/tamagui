import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Rect } from 'react-native-svg'
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
      <Line x1="6" x2="10" y1="12" y2="12" stroke={color} />
      <Line x1="8" x2="8" y1="10" y2="14" stroke={color} />
      <Line x1="15" x2="15.01" y1="13" y2="13" stroke={color} />
      <Line x1="18" x2="18.01" y1="11" y2="11" stroke={color} />
      <Rect width="20" height="12" x="2" y="6" rx="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Gamepad'

export const Gamepad = memo<IconProps>(themed(Icon))
