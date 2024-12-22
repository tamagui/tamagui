import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
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
      <Rect x="2" y="6" width="20" height="8" rx="1" stroke={color} />
      <Path d="M17 14v7" stroke={color} />
      <Path d="M7 14v7" stroke={color} />
      <Path d="M17 3v3" stroke={color} />
      <Path d="M7 3v3" stroke={color} />
      <Path d="M10 14 2.3 6.3" stroke={color} />
      <Path d="m14 6 7.7 7.7" stroke={color} />
      <Path d="m8 6 8 8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Construction'

export const Construction = memo<IconProps>(themed(Icon))
