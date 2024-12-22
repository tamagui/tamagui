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
      <Path d="M14 19a6 6 0 0 0-12 0" stroke={color} />
      <_Circle cx="8" cy="9" r="4" stroke={color} />
      <Path d="M22 19a6 6 0 0 0-6-6 4 4 0 1 0 0-8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Users2'

export const Users2 = React.memo<IconProps>(themed(Icon))
