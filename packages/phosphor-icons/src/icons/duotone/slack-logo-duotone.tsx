import PropTypes from 'prop-types'
import React, { memo } from 'react'
import {
  Circle as _Circle,
  Defs as _Defs,
  Ellipse as _Ellipse,
  G as _G,
  Line as _Line,
  LinearGradient as _LinearGradient,
  Path as _Path,
  Polygon as _Polygon,
  Polyline as _Polyline,
  RadialGradient as _RadialGradient,
  Rect as _Rect,
  Stop as _Stop,
  Svg as _Svg,
  Symbol as _Symbol,
  Text as _Text,
  Use as _Use,
} from 'react-native-svg'

import { IconProps } from '../../IconProps'
import { themed } from '../../themed'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <_Svg
      viewBox="0 0 256 256"
      {...otherProps}
      height={size}
      width={size}
      fill={`${color}`}
    >
      <_Rect width="256" height="256" fill="none" />
      <_Path
        d="M176,104h24a0,0,0,0,1,0,0v72a24,24,0,0,1-24,24h0a24,24,0,0,1-24-24V128a24,24,0,0,1,24-24Z"
        transform="translate(24 328) rotate(-90)"
        opacity="0.2"
      />
      <_Path
        d="M128,176h24a23.9,23.9,0,0,1,24,24h0a23.9,23.9,0,0,1-24,24h0a23.9,23.9,0,0,1-24-24Z"
        opacity="0.2"
      />
      <_Path
        d="M80,56h24a0,0,0,0,1,0,0v72a24,24,0,0,1-24,24h0a24,24,0,0,1-24-24V80A24,24,0,0,1,80,56Z"
        transform="translate(184 24) rotate(90)"
        opacity="0.2"
      />
      <_Path
        d="M128,80H104A23.9,23.9,0,0,1,80,56h0a23.9,23.9,0,0,1,24-24h0a23.9,23.9,0,0,1,24,24Z"
        opacity="0.2"
      />
      <_Path
        d="M80,56h24a0,0,0,0,1,0,0v72a24,24,0,0,1-24,24h0a24,24,0,0,1-24-24V80A24,24,0,0,1,80,56Z"
        transform="translate(184 24) rotate(90)"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M128,80H104A23.9,23.9,0,0,1,80,56h0a23.9,23.9,0,0,1,24-24h0a23.9,23.9,0,0,1,24,24Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M152,32h24a0,0,0,0,1,0,0v72a24,24,0,0,1-24,24h0a24,24,0,0,1-24-24V56A24,24,0,0,1,152,32Z"
        transform="translate(304 160) rotate(180)"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M176,128V104a23.9,23.9,0,0,1,24-24h0a23.9,23.9,0,0,1,24,24h0a23.9,23.9,0,0,1-24,24Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M176,104h24a0,0,0,0,1,0,0v72a24,24,0,0,1-24,24h0a24,24,0,0,1-24-24V128a24,24,0,0,1,24-24Z"
        transform="translate(24 328) rotate(-90)"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M128,176h24a23.9,23.9,0,0,1,24,24h0a23.9,23.9,0,0,1-24,24h0a23.9,23.9,0,0,1-24-24Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M104,128h24a0,0,0,0,1,0,0v72a24,24,0,0,1-24,24h0a24,24,0,0,1-24-24V152A24,24,0,0,1,104,128Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M80,128v24a23.9,23.9,0,0,1-24,24h0a23.9,23.9,0,0,1-24-24h0a23.9,23.9,0,0,1,24-24Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'SlackLogoDuotone'

export const SlackLogoDuotone = memo<IconProps>(themed(Icon))
