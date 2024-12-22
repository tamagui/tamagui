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
      <Rect width="20" height="16" x="2" y="4" rx="2" stroke={color} />
      <Path d="M2 8h20" stroke={color} />
      <_Circle cx="8" cy="14" r="2" stroke={color} />
      <Path d="M8 12h8" stroke={color} />
      <_Circle cx="16" cy="14" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Videotape'

export const Videotape = memo<IconProps>(themed(Icon))
