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
      <Path d="M13.5 3.1c-.5 0-1-.1-1.5-.1s-1 .1-1.5.1" stroke={color} />
      <Path d="M19.3 6.8a10.45 10.45 0 0 0-2.1-2.1" stroke={color} />
      <Path d="M20.9 13.5c.1-.5.1-1 .1-1.5s-.1-1-.1-1.5" stroke={color} />
      <Path d="M17.2 19.3a10.45 10.45 0 0 0 2.1-2.1" stroke={color} />
      <Path d="M10.5 20.9c.5.1 1 .1 1.5.1s1-.1 1.5-.1" stroke={color} />
      <Path d="M3.5 17.5 2 22l4.5-1.5" stroke={color} />
      <Path d="M3.1 10.5c0 .5-.1 1-.1 1.5s.1 1 .1 1.5" stroke={color} />
      <Path d="M6.8 4.7a10.45 10.45 0 0 0-2.1 2.1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MessageCircleDashed'

export const MessageCircleDashed = memo<IconProps>(themed(Icon))
