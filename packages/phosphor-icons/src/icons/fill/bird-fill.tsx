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
      <_Path d="M236.4,73.3,213.2,57.9A60,60,0,0,0,96,76V93.2L1.8,211A8,8,0,0,0,8,224H112A104.2,104.2,0,0,0,216,120V100.3l20.4-13.6a8,8,0,0,0,0-13.4ZM110.1,141.1l-40,48a8,8,0,0,1-12.2-10.2l40-48a8,8,0,1,1,12.2,10.2ZM164,80a12,12,0,1,1,12-12A12,12,0,0,1,164,80Z" />
    </_Svg>
  )
}

Icon.displayName = 'BirdFill'

export const BirdFill = memo<IconProps>(themed(Icon))
