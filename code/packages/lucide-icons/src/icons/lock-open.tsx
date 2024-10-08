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
      <Rect width="18" height="11" x="3" y="11" rx="2" ry="2" stroke={color} />
      <Path d="M7 11V7a5 5 0 0 1 9.9-1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'LockOpen'

export const LockOpen = memo<IconProps>(themed(Icon))
