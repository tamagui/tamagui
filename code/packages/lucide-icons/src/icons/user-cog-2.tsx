import React from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { themed } from '@tamagui/helpers-icon'

import { Path, Svg, Circle as _Circle } from 'react-native-svg'

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
      <_Circle cx="18" cy="15" r="3" stroke={color} />
      <_Circle cx="8" cy="9" r="4" stroke={color} />
      <Path d="M10.5 13.5A6 6 0 0 0 2 19" stroke={color} />
      <Path d="m21.7 16.4-.9-.3" stroke={color} />
      <Path d="m15.2 13.9-.9-.3" stroke={color} />
      <Path d="m16.6 18.7.3-.9" stroke={color} />
      <Path d="m19.1 12.2.3-.9" stroke={color} />
      <Path d="m19.6 18.7-.4-1" stroke={color} />
      <Path d="m16.8 12.3-.4-1" stroke={color} />
      <Path d="m14.3 16.6 1-.4" stroke={color} />
      <Path d="m20.7 13.8 1-.4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'UserCog2'

export const UserCog2 = React.memo<IconProps>(themed(Icon))
