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
      <Line x1="19" x2="10" y1="4" y2="4" stroke={color} />
      <Line x1="14" x2="5" y1="20" y2="20" stroke={color} />
      <Line x1="15" x2="9" y1="4" y2="20" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Italic'

export const Italic = memo<IconProps>(themed(Icon))
