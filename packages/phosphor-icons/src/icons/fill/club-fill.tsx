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
      <_Path d="M232,148a52,52,0,0,1-80.5,43.5l10.7,34.1a7.8,7.8,0,0,1-1.2,7.1,7.9,7.9,0,0,1-6.4,3.3H101.4a7.9,7.9,0,0,1-6.4-3.3,7.8,7.8,0,0,1-1.2-7.1l10.7-34.1a51.7,51.7,0,0,1-30,8.5c-27.7-.8-50.4-24-50.5-51.8A52.1,52.1,0,0,1,76,96l4,.2a53.3,53.3,0,0,1-3.9-23.4,52,52,0,1,1,99.8,23.4A51.5,51.5,0,0,1,232,148Z" />
    </_Svg>
  )
}

Icon.displayName = 'ClubFill'

export const ClubFill = memo<IconProps>(themed(Icon))
