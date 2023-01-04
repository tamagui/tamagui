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
      <_Path d="M210.7,72H200V40a8,8,0,0,0-8-8H64a8,8,0,0,0-8,8V72H45.3C31.4,72,20,82.8,20,96v80a8,8,0,0,0,8,8H56v36a8,8,0,0,0,8,8H192a8,8,0,0,0,8-8V184h28a8,8,0,0,0,8-8V96C236,82.8,224.6,72,210.7,72ZM72,48H184V72H72ZM184,212H72V160H184Zm4-84a12,12,0,1,1,12-12A12,12,0,0,1,188,128Z" />
    </_Svg>
  )
}

Icon.displayName = 'PrinterFill'

export const PrinterFill = memo<IconProps>(themed(Icon))
