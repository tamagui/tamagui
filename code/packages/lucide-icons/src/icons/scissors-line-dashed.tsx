import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
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
      <Path d="M5.42 9.42 8 12" stroke={color} />
      <_Circle cx="4" cy="8" r="2" stroke={color} />
      <Path d="m14 6-8.58 8.58" stroke={color} />
      <_Circle cx="4" cy="16" r="2" stroke={color} />
      <Path d="M10.8 14.8 14 18" stroke={color} />
      <Path d="M16 12h-2" stroke={color} />
      <Path d="M22 12h-2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ScissorsLineDashed'

export const ScissorsLineDashed = memo<IconProps>(themed(Icon))
