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
      <Path d="M18 21a6 6 0 0 0-12 0" stroke={color} />
      <_Circle cx="12" cy="11" r="4" stroke={color} />
      <Rect width="18" height="18" x="3" y="3" rx="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SquareUserRound'

export const SquareUserRound = memo<IconProps>(themed(Icon))
