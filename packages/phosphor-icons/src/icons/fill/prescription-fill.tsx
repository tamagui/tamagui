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
      <_Path d="M183.3,188l22.4-22.3a8.1,8.1,0,0,0-11.4-11.4L172,176.7,130.3,135A52,52,0,0,0,120,32H72a8,8,0,0,0-8,8V192a8,8,0,0,0,16,0V136h28.7l52,52-22.4,22.3a8.1,8.1,0,0,0,0,11.4,8.2,8.2,0,0,0,11.4,0L172,199.3l22.3,22.4a8.2,8.2,0,0,0,11.4,0,8.1,8.1,0,0,0,0-11.4ZM80,48h40a36,36,0,0,1,0,72H80Z" />
    </_Svg>
  )
}

Icon.displayName = 'PrescriptionFill'

export const PrescriptionFill = memo<IconProps>(themed(Icon))
