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
    <_Svg viewBox="0 0 256 256" {...otherProps} height={size} width={size}>
      <_Rect width="256" height="256" fill="none" />
      <_Path
        d="M45.4,177A95.9,95.9,0,1,1,79,210.6h0L45.8,220a7.9,7.9,0,0,1-9.8-9.8L45.4,177Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <_Path
        d="M80,103.5A23.9,23.9,0,0,1,104,80h3.5a7.9,7.9,0,0,1,6.8,3.9l7.4,12.3a7.8,7.8,0,0,1,.3,7.7l-4.7,9.6h0a36,36,0,0,0,25.2,25.2h0l9.6-4.7a7.8,7.8,0,0,1,7.7.3l12.3,7.4a7.9,7.9,0,0,1,3.9,6.8V152a23.9,23.9,0,0,1-23.5,24A71.9,71.9,0,0,1,80,103.5Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
    </_Svg>
  )
}

Icon.displayName = 'WhatsappLogoBold'

export const WhatsappLogoBold = memo<IconProps>(themed(Icon))
