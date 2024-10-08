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
        d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"
        stroke={color}
      />
      <Line x1="16" x2="16" y1="2" y2="6" stroke={color} />
      <Line x1="8" x2="8" y1="2" y2="6" stroke={color} />
      <Line x1="3" x2="21" y1="10" y2="10" stroke={color} />
      <Line x1="17" x2="22" y1="17" y2="22" stroke={color} />
      <Line x1="17" x2="22" y1="22" y2="17" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CalendarX2'

export const CalendarX2 = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
