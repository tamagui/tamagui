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
      <Path d="M18 20a6 6 0 0 0-12 0" stroke={color} />
      <_Circle cx="12" cy="10" r="4" stroke={color} />
      <_Circle cx="12" cy="12" r="10" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'UserCircle2'

export const UserCircle2 = React.memo<IconProps>(themed(Icon))
