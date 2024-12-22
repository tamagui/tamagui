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
      <_Circle cx="12" cy="17" r="3" stroke={color} />
      <Path d="M4.2 15.1A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.2" stroke={color} />
      <Path d="m15.7 18.4-.9-.3" stroke={color} />
      <Path d="m9.2 15.9-.9-.3" stroke={color} />
      <Path d="m10.6 20.7.3-.9" stroke={color} />
      <Path d="m13.1 14.2.3-.9" stroke={color} />
      <Path d="m13.6 20.7-.4-1" stroke={color} />
      <Path d="m10.8 14.3-.4-1" stroke={color} />
      <Path d="m8.3 18.6 1-.4" stroke={color} />
      <Path d="m14.7 15.8 1-.4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CloudCog'

export const CloudCog = memo<IconProps>(themed(Icon))
