import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Polygon } from 'react-native-svg'
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
      <Polygon
        points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"
        stroke={color}
      />
      <Line x1="12" x2="12" y1="8" y2="12" stroke={color} />
      <Line x1="12" x2="12.01" y1="16" y2="16" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'AlertOctagon'

export const AlertOctagon = memo<IconProps>(themed(Icon))
