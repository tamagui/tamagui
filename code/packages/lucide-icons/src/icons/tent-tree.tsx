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
      <_Circle cx="4" cy="4" r="2" stroke={color} />
      <Path d="m14 5 3-3 3 3" stroke={color} />
      <Path d="m14 10 3-3 3 3" stroke={color} />
      <Path d="M17 14V2" stroke={color} />
      <Path d="M17 14H7l-5 8h20Z" stroke={color} />
      <Path d="M8 14v8" stroke={color} />
      <Path d="m9 14 5 8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'TentTree'

export const TentTree = memo<IconProps>(themed(Icon))
