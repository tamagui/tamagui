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
        d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-.5"
        stroke={color}
      />

      <Path d="M16 4h2a2 2 0 0 1 1.73 1" stroke={color} />
      <Path
        d="M18.42 9.61a2.1 2.1 0 1 1 2.97 2.97L16.95 17 13 18l.99-3.95 4.43-4.44Z"
        stroke={color}
      />

      <Path d="M8 18h1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ClipboardSignature'

export const ClipboardSignature = React.memo<IconProps>(themed(Icon))
