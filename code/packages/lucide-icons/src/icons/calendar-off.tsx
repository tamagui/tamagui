import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Path } from 'react-native-svg'
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
      <Path
        d="M4.18 4.18A2 2 0 0 0 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 1.82-1.18"
        stroke={color}
      />
      <Path d="M21 15.5V6a2 2 0 0 0-2-2H9.5" stroke={color} />
      <Path d="M16 2v4" stroke={color} />
      <Path d="M3 10h7" stroke={color} />
      <Path d="M21 10h-5.5" stroke={color} />
      <Line x1="2" x2="22" y1="2" y2="22" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CalendarOff'

export const CalendarOff = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
