import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
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
      <Path
        d="M21 17V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11Z"
        stroke={color}
      />
      <Path d="M3 10h18" stroke={color} />
      <Path d="M15 22v-4a2 2 0 0 1 2-2h4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CalendarFold'

export const CalendarFold = memo<IconProps>(themed(Icon))
