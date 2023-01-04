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
        d="M211.8,133.1c.3-3.4,0-10.2,0-10.2l16.6-22.1a103.2,103.2,0,0,0-10.2-24.6l-27.3-3.9q-3.5-3.7-7.2-7.2l-3.9-27.3a102.2,102.2,0,0,0-24.6-10.2L133.1,44.2a57.9,57.9,0,0,0-10.2,0L100.8,27.6A103.2,103.2,0,0,0,76.2,37.8L72.3,65.1q-3.7,3.5-7.2,7.2L37.8,76.2a102.2,102.2,0,0,0-10.2,24.6l16.6,22.1c-.2,3.4,0,10.2,0,10.2L27.6,155.2a103.2,103.2,0,0,0,10.2,24.6l27.3,3.9q3.5,3.8,7.2,7.2l3.9,27.3a102.2,102.2,0,0,0,24.6,10.2l22.1-16.6a57.9,57.9,0,0,0,10.2,0l22.1,16.6a103.2,103.2,0,0,0,24.6-10.2l3.9-27.3c2.5-2.3,7.2-7.2,7.2-7.2l27.3-3.9a102.2,102.2,0,0,0,10.2-24.6ZM128,176a48,48,0,1,1,48-48A48,48,0,0,1,128,176Z"
        opacity="0.2"
      />
      <_Circle
        cx="128"
        cy="128"
        r="48"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M183.7,65.1q3.8,3.5,7.2,7.2l27.3,3.9a103.2,103.2,0,0,1,10.2,24.6l-16.6,22.1s.3,6.8,0,10.2l16.6,22.1a102.2,102.2,0,0,1-10.2,24.6l-27.3,3.9s-4.7,4.9-7.2,7.2l-3.9,27.3a103.2,103.2,0,0,1-24.6,10.2l-22.1-16.6a57.9,57.9,0,0,1-10.2,0l-22.1,16.6a102.2,102.2,0,0,1-24.6-10.2l-3.9-27.3q-3.7-3.5-7.2-7.2l-27.3-3.9a103.2,103.2,0,0,1-10.2-24.6l16.6-22.1s-.2-6.8,0-10.2L27.6,100.8A102.2,102.2,0,0,1,37.8,76.2l27.3-3.9q3.5-3.7,7.2-7.2l3.9-27.3a103.2,103.2,0,0,1,24.6-10.2l22.1,16.6a57.9,57.9,0,0,1,10.2,0l22.1-16.6a102.2,102.2,0,0,1,24.6,10.2Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'GearDuotone'

export const GearDuotone = memo<IconProps>(themed(Icon))
