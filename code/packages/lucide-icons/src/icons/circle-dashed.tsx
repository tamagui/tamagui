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
      <Path d="M10.1 2.182a10 10 0 0 1 3.8 0" stroke={color} />
      <Path d="M13.9 21.818a10 10 0 0 1-3.8 0" stroke={color} />
      <Path d="M17.609 3.721a10 10 0 0 1 2.69 2.7" stroke={color} />
      <Path d="M2.182 13.9a10 10 0 0 1 0-3.8" stroke={color} />
      <Path d="M20.279 17.609a10 10 0 0 1-2.7 2.69" stroke={color} />
      <Path d="M21.818 10.1a10 10 0 0 1 0 3.8" stroke={color} />
      <Path d="M3.721 6.391a10 10 0 0 1 2.7-2.69" stroke={color} />
      <Path d="M6.391 20.279a10 10 0 0 1-2.69-2.7" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CircleDashed'

export const CircleDashed = memo<IconProps>(themed(Icon))
