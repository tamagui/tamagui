import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
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
      <Path d="M16 2v4" stroke={color} />
      <Path
        d="M21 11.75V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.25"
        stroke={color}
      />
      <Path d="m22 22-1.875-1.875" stroke={color} />
      <Path d="M3 10h18" stroke={color} />
      <Path d="M8 2v4" stroke={color} />
      <_Circle cx="18" cy="18" r="3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CalendarSearch'

export const CalendarSearch = memo<IconProps>(themed(Icon))
