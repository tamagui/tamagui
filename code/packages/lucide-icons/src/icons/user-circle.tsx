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
      <_Circle cx="12" cy="12" r="10" stroke={color} />
      <_Circle cx="12" cy="10" r="3" stroke={color} />
      <Path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'UserCircle'

export const UserCircle = React.memo<IconProps>(themed(Icon))
