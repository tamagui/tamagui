import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Path } from 'react-native-svg'
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
      <Path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" stroke={color} />
      <Path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke={color} />
      <Line x1="12" x2="12" y1="19" y2="22" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Mic'

export const Mic = memo<IconProps>(themed(Icon))
