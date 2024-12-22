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
      <Path d="M4 9V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" stroke={color} />
      <Path d="M8 8v1" stroke={color} />
      <Path d="M12 8v1" stroke={color} />
      <Path d="M16 8v1" stroke={color} />
      <Rect width="20" height="12" x="2" y="9" rx="2" stroke={color} />
      <_Circle cx="8" cy="15" r="2" stroke={color} />
      <_Circle cx="16" cy="15" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BoomBox'

export const BoomBox = memo<IconProps>(themed(Icon))
