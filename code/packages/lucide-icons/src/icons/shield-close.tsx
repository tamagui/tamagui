import React from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { themed } from '@tamagui/helpers-icon'

import { Line, Path, Svg } from 'react-native-svg'

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
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} />
      <Line x1="9.5" x2="14.5" y1="9" y2="14" stroke={color} />
      <Line x1="14.5" x2="9.5" y1="9" y2="14" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ShieldClose'

export const ShieldClose = React.memo<IconProps>(themed(Icon))
