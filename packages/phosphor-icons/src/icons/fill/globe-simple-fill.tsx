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
      <_Path d="M232,128A104.1,104.1,0,0,0,128,24h0a104,104,0,0,0,0,208h0A104.1,104.1,0,0,0,232,128Zm-16.4-8H175.8c-1.6-29.6-12-57-29.5-78.1A88.2,88.2,0,0,1,215.6,120ZM96.3,136h63.4c-1.8,28.8-13.3,55.7-31.7,74.4C109.6,191.7,98.1,164.8,96.3,136Zm0-16c1.8-28.8,13.3-55.7,31.7-74.4,18.4,18.7,29.9,45.6,31.7,74.4Zm50,94.1c17.5-21.1,27.9-48.5,29.5-78.1h39.8A88.2,88.2,0,0,1,146.3,214.1Z" />
    </_Svg>
  )
}

Icon.displayName = 'GlobeSimpleFill'

export const GlobeSimpleFill = memo<IconProps>(themed(Icon))
