import React from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { themed } from '@tamagui/helpers-icon'

import { Path, Rect, Svg } from 'react-native-svg'

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
      <Rect width="18" height="18" x="3" y="3" rx="2" stroke={color} />
      <Path d="M12 8v8" stroke={color} />
      <Path d="m8.5 14 7-4" stroke={color} />
      <Path d="m8.5 10 7 4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SquareAsterisk'

export const SquareAsterisk = React.memo<IconProps>(themed(Icon))
