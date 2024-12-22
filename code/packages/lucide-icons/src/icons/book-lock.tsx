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
      <Path d="M18 6V4a2 2 0 1 0-4 0v2" stroke={color} />
      <Path d="M20 15v6a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" stroke={color} />
      <Path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H10" stroke={color} />
      <Rect x="12" y="6" width="8" height="5" rx="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BookLock'

export const BookLock = memo<IconProps>(themed(Icon))
