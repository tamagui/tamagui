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
      <_Circle cx="6" cy="19" r="3" stroke={color} />
      <Path d="M9 19h8.5c.4 0 .9-.1 1.3-.2" stroke={color} />
      <Path d="M5.2 5.2A3.5 3.53 0 0 0 6.5 12H12" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
      <Path d="M21 15.3a3.5 3.5 0 0 0-3.3-3.3" stroke={color} />
      <Path d="M15 5h-4.3" stroke={color} />
      <_Circle cx="18" cy="5" r="3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'RouteOff'

export const RouteOff = memo<IconProps>(themed(Icon))
