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
      <_Circle cx="12" cy="12" r="3" stroke={color} />
      <Path
        d="M4.5 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-.5"
        stroke={color}
      />
      <Path
        d="M4.5 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-.5"
        stroke={color}
      />
      <Path d="M6 6h.01" stroke={color} />
      <Path d="M6 18h.01" stroke={color} />
      <Path d="m15.7 13.4-.9-.3" stroke={color} />
      <Path d="m9.2 10.9-.9-.3" stroke={color} />
      <Path d="m10.6 15.7.3-.9" stroke={color} />
      <Path d="m13.6 15.7-.4-1" stroke={color} />
      <Path d="m10.8 9.3-.4-1" stroke={color} />
      <Path d="m8.3 13.6 1-.4" stroke={color} />
      <Path d="m14.7 10.8 1-.4" stroke={color} />
      <Path d="m13.4 8.3-.3.9" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ServerCog'

export const ServerCog = memo<IconProps>(themed(Icon))
