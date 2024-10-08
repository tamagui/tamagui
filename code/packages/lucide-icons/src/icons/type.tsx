import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Polyline } from 'react-native-svg'
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
      <Polyline points="4 7 4 4 20 4 20 7" stroke={color} />
      <Line x1="9" x2="15" y1="20" y2="20" stroke={color} />
      <Line x1="12" x2="12" y1="4" y2="20" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Type'

export const Type = memo<IconProps>(themed(Icon))
