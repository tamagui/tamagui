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
      <Path d="M10 18H5a3 3 0 0 1-3-3v-1" stroke={color} />
      <Path d="M14 2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2" stroke={color} />
      <Path d="M20 2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2" stroke={color} />
      <Path d="m7 21 3-3-3-3" stroke={color} />
      <Rect x="14" y="14" width="8" height="8" rx="2" stroke={color} />
      <Rect x="2" y="2" width="8" height="8" rx="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Combine'

export const Combine = memo<IconProps>(themed(Icon))
