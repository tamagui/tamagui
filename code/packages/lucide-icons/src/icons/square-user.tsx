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
      <Rect width="18" height="18" x="3" y="3" rx="2" stroke={color} />
      <_Circle cx="12" cy="10" r="3" stroke={color} />
      <Path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SquareUser'

export const SquareUser = memo<IconProps>(themed(Icon))
