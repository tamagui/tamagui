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
      <Rect width="20" height="8" x="2" y="2" rx="2" ry="2" stroke={color} />
      <Rect width="20" height="8" x="2" y="14" rx="2" ry="2" stroke={color} />
      <Line x1="6" x2="6.01" y1="6" y2="6" stroke={color} />
      <Line x1="6" x2="6.01" y1="18" y2="18" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Server'

export const Server = memo<IconProps>(themed(Icon))
