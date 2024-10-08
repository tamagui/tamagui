import React from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { themed } from '@tamagui/helpers-icon'

import { Path, Polyline, Svg, Circle as _Circle } from 'react-native-svg'

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
      <Path
        d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
        stroke={color}
      />

      <Polyline points="14 2 14 8 20 8" stroke={color} />
      <_Circle cx="12" cy="15" r="2" stroke={color} />
      <Path d="M12 12v1" stroke={color} />
      <Path d="M12 17v1" stroke={color} />
      <Path d="m14.6 13.5-.87.5" stroke={color} />
      <Path d="m10.27 16-.87.5" stroke={color} />
      <Path d="m14.6 16.5-.87-.5" stroke={color} />
      <Path d="m10.27 14-.87-.5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FileCog2'

export const FileCog2 = React.memo<IconProps>(themed(Icon))
