import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path, Rect } from 'react-native-svg'
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
      <Path d="M22 18H6a2 2 0 0 1-2-2V7a2 2 0 0 0-2-2" stroke={color} />
      <Path d="M17 14V4a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v10" stroke={color} />
      <Rect width="13" height="8" x="8" y="6" rx="1" stroke={color} />
      <_Circle cx="18" cy="20" r="2" stroke={color} />
      <_Circle cx="9" cy="20" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BaggageClaim'

export const BaggageClaim = memo<IconProps>(themed(Icon))
