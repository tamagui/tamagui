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
      <Rect width="8" height="4" x="8" y="2" rx="1" ry="1" stroke={color} />
      <Path
        d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z"
        stroke={color}
      />

      <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5.5" stroke={color} />
      <Path d="M4 13.5V6a2 2 0 0 1 2-2h2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ClipboardEdit'

export const ClipboardEdit = React.memo<IconProps>(themed(Icon))
