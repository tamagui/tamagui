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
      <Path d="M8 2v4" stroke={color} />
      <Path d="M16 2v4" stroke={color} />
      <Rect width="18" height="18" x="3" y="4" rx="2" stroke={color} />
      <Path d="M3 10h18" stroke={color} />
      <Path d="m9 16 2 2 4-4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CalendarCheck'

export const CalendarCheck = memo<IconProps>(themed(Icon))
