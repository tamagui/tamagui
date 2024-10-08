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
      <Polyline points="5 11 5 5 11 5" stroke={color} />
      <Polyline points="19 13 19 19 13 19" stroke={color} />
      <Line x1="5" x2="19" y1="5" y2="19" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MoveDiagonal2'

export const MoveDiagonal2 = memo<IconProps>(themed(Icon))
