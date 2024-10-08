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
      <Path d="m15.2 16.9-.9-.4" stroke={color} />
      <Path d="m15.2 19.1-.9.4" stroke={color} />
      <Path d="M16 2v4" stroke={color} />
      <Path d="m16.9 15.2-.4-.9" stroke={color} />
      <Path d="m16.9 20.8-.4.9" stroke={color} />
      <Path d="m19.5 14.3-.4.9" stroke={color} />
      <Path d="m19.5 21.7-.4-.9" stroke={color} />
      <Path
        d="M21 10.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"
        stroke={color}
      />
      <Path d="m21.7 16.5-.9.4" stroke={color} />
      <Path d="m21.7 19.5-.9-.4" stroke={color} />
      <Path d="M3 10h18" stroke={color} />
      <Path d="M8 2v4" stroke={color} />
      <_Circle cx="18" cy="18" r="3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CalendarCog'

export const CalendarCog = memo<IconProps>(themed(Icon))
