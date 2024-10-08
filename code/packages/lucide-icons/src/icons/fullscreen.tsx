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
      <Path d="M3 7V5a2 2 0 0 1 2-2h2" stroke={color} />
      <Path d="M17 3h2a2 2 0 0 1 2 2v2" stroke={color} />
      <Path d="M21 17v2a2 2 0 0 1-2 2h-2" stroke={color} />
      <Path d="M7 21H5a2 2 0 0 1-2-2v-2" stroke={color} />
      <Rect width="10" height="8" x="7" y="8" rx="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Fullscreen'

export const Fullscreen = memo<IconProps>(themed(Icon))
