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
      <Path d="M12 17v4" stroke={color} />
      <Path d="m15.2 4.9-.9-.4" stroke={color} />
      <Path d="m15.2 7.1-.9.4" stroke={color} />
      <Path d="m16.9 3.2-.4-.9" stroke={color} />
      <Path d="m16.9 8.8-.4.9" stroke={color} />
      <Path d="m19.5 2.3-.4.9" stroke={color} />
      <Path d="m19.5 9.7-.4-.9" stroke={color} />
      <Path d="m21.7 4.5-.9.4" stroke={color} />
      <Path d="m21.7 7.5-.9-.4" stroke={color} />
      <Path d="M22 13v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" stroke={color} />
      <Path d="M8 21h8" stroke={color} />
      <_Circle cx="18" cy="6" r="3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MonitorCog'

export const MonitorCog = memo<IconProps>(themed(Icon))
