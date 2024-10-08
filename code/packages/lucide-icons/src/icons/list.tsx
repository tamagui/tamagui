import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line } from 'react-native-svg'
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
      <Line x1="8" x2="21" y1="6" y2="6" stroke={color} />
      <Line x1="8" x2="21" y1="12" y2="12" stroke={color} />
      <Line x1="8" x2="21" y1="18" y2="18" stroke={color} />
      <Line x1="3" x2="3.01" y1="6" y2="6" stroke={color} />
      <Line x1="3" x2="3.01" y1="12" y2="12" stroke={color} />
      <Line x1="3" x2="3.01" y1="18" y2="18" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'List'

export const List = memo<IconProps>(themed(Icon))
