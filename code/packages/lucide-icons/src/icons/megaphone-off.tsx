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
      <Path d="M9.26 9.26 3 11v3l14.14 3.14" stroke={color} />
      <Path d="M21 15.34V6l-7.31 2.03" stroke={color} />
      <Path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" stroke={color} />
      <Line x1="2" x2="22" y1="2" y2="22" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MegaphoneOff'

export const MegaphoneOff = memo<IconProps>(themed(Icon))
