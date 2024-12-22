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
      <Path d="M14 15h1" stroke={color} />
      <Path d="M19 15h2" stroke={color} />
      <Path d="M3 15h2" stroke={color} />
      <Path d="M9 15h1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'PanelBottomInactive'

export const PanelBottomInactive = React.memo<IconProps>(themed(Icon))
