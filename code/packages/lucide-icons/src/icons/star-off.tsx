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
      <Path
        d="M8.34 8.34 2 9.27l5 4.87L5.82 21 12 17.77 18.18 21l-.59-3.43"
        stroke={color}
      />
      <Path d="M18.42 12.76 22 9.27l-6.91-1L12 2l-1.44 2.91" stroke={color} />
      <Line x1="2" x2="22" y1="2" y2="22" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'StarOff'

export const StarOff = memo<IconProps>(themed(Icon))
