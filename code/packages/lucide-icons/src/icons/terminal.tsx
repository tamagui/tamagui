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
      <Polyline points="4 17 10 11 4 5" stroke={color} />
      <Line x1="12" x2="20" y1="19" y2="19" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Terminal'

export const Terminal = memo<IconProps>(themed(Icon))
